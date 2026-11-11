import { Router } from "express";
import { config } from "../config.js";
import { db } from "../db.js";
import { userFromRequest, requireAuth, requireAdmin } from "../auth.js";
import { round2 } from "../utils.js";

const router = Router();

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

const toOrderJSON = (row) => ({
  id: row.code,
  createdAt: row.created_at,
  status: row.status,
  customer: JSON.parse(row.customer_json),
  paymentMethod: row.payment_method,
  items: db
    .prepare(
      "SELECT product_id, name, price, image, quantity FROM order_items WHERE order_id = ? ORDER BY id ASC",
    )
    .all(row.id)
    .map((item) => ({
      id: item.product_id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    })),
  subtotal: row.subtotal,
  shipping: row.shipping,
  discountCode: row.discount_code,
  discountAmount: row.discount_amount,
  total: row.total,
});

const findOrder = (key) => {
  const code = String(key);
  return /^\d+$/.test(code)
    ? db.prepare("SELECT * FROM orders WHERE id = ? OR code = ?").get(Number(code), code)
    : db.prepare("SELECT * FROM orders WHERE code = ?").get(code);
};

/* POST /api/orders — place an order (guest or signed-in customer).
   Totals are always recomputed server-side from the database prices. */
router.post("/", (req, res) => {
  const user = userFromRequest(req); // optional — attaches the order to the account
  const { customer = {}, paymentMethod = "cash", items, discountCode = null } =
    req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const cleanCustomer = {
    email: String(customer.email || "").trim(),
    phone: String(customer.phone || "").trim(),
    firstName: String(customer.firstName || "").trim(),
    lastName: String(customer.lastName || "").trim(),
    address: String(customer.address || "").trim(),
    city: String(customer.city || "").trim(),
    zip: String(customer.zip || "").trim(),
    notes: String(customer.notes || "").trim(),
  };
  cleanCustomer.fullName = `${cleanCustomer.firstName} ${cleanCustomer.lastName}`.trim();

  if (
    !cleanCustomer.email ||
    !cleanCustomer.firstName ||
    !cleanCustomer.lastName ||
    !cleanCustomer.address ||
    !cleanCustomer.city
  ) {
    return res
      .status(400)
      .json({ error: "Please complete the contact and shipping details." });
  }
  if (!["cash", "card"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Unsupported payment method." });
  }

  // Validate cart against the catalog and live stock levels.
  const lineItems = [];
  for (const item of items) {
    const productId = Number(item && item.id);
    const quantity = Math.max(1, Math.trunc(Number(item && item.quantity) || 1));
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "Invalid product in cart." });
    }
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
    if (!product) {
      return res
        .status(400)
        .json({ error: "One of the items in your cart is no longer available." });
    }
    if (product.quantity != null && product.quantity < quantity) {
      return res.status(400).json({
        error: `Only ${product.quantity} left in stock for ${product.name}.`,
      });
    }
    const existing = lineItems.find((line) => line.product.id === productId);
    if (existing) existing.quantity += quantity;
    else lineItems.push({ product, quantity });
  }

  // Discount codes are validated server-side too.
  let discount = null;
  if (discountCode) {
    discount = db
      .prepare("SELECT * FROM discount_codes WHERE code = ? AND active = 1")
      .get(String(discountCode).trim().toUpperCase());
  }

  const subtotal = round2(
    lineItems.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
  );
  const discountAmount = discount ? round2(subtotal * discount.percent) : 0;
  const shipping = config.shippingFee;
  const total = round2(subtotal - discountAmount + shipping);
  const createdAt = new Date().toISOString();

  db.exec("BEGIN");
  try {
    const result = db
      .prepare(
        `INSERT INTO orders
          (user_id, customer_json, payment_method, status, subtotal, shipping,
           discount_code, discount_amount, total, created_at)
         VALUES (?, ?, ?, 'Processing', ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        user ? user.id : null,
        JSON.stringify(cleanCustomer),
        paymentMethod,
        subtotal,
        shipping,
        discount ? discount.code : null,
        discountAmount,
        total,
        createdAt,
      );
    const orderId = Number(result.lastInsertRowid);
    const code = `VT-${String(orderId).padStart(6, "0")}`;
    db.prepare("UPDATE orders SET code = ? WHERE id = ?").run(code, orderId);

    const insertItem = db.prepare(
      "INSERT INTO order_items (order_id, product_id, name, price, image, quantity) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const updateStock = db.prepare(
      "UPDATE products SET quantity = quantity - ? WHERE id = ?",
    );
    for (const line of lineItems) {
      insertItem.run(
        orderId,
        line.product.id,
        line.product.name,
        line.product.price,
        line.product.image,
        line.quantity,
      );
      updateStock.run(line.quantity, line.product.id);
    }
    db.exec("COMMIT");

    const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    res.status(201).json({ data: toOrderJSON(row) });
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
});

/* GET /api/orders — signed-in customer: own orders; admin: all orders */
router.get("/", requireAuth, (req, res) => {
  const rows =
    req.user.role === "admin"
      ? db
          .prepare("SELECT * FROM orders ORDER BY created_at DESC, id DESC")
          .all()
      : db
          .prepare(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC",
          )
          .all(req.user.id);
  res.json({ data: rows.map(toOrderJSON) });
});

/* GET /api/orders/:id — owner or admin */
router.get("/:id", requireAuth, (req, res) => {
  const row = findOrder(req.params.id);
  if (!row) return res.status(404).json({ error: "Order not found." });
  if (req.user.role !== "admin" && row.user_id !== req.user.id) {
    return res.status(403).json({ error: "You can only view your own orders." });
  }
  res.json({ data: toOrderJSON(row) });
});

/* PATCH /api/orders/:id — admin: update status */
router.patch("/:id", requireAdmin, (req, res) => {
  const row = findOrder(req.params.id);
  if (!row) return res.status(404).json({ error: "Order not found." });
  const status = String((req.body || {}).status || "");
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Status must be one of: ${ORDER_STATUSES.join(", ")}.`,
    });
  }
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, row.id);
  const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(row.id);
  res.json({ data: toOrderJSON(updated) });
});

/* DELETE /api/orders/:id — admin: delete order (and its items) */
router.delete("/:id", requireAdmin, (req, res) => {
  const row = findOrder(req.params.id);
  if (!row) return res.status(404).json({ error: "Order not found." });
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM order_items WHERE order_id = ?").run(row.id);
    db.prepare("DELETE FROM orders WHERE id = ?").run(row.id);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  res.json({ data: { deleted: true, id: row.code } });
});

export default router;
