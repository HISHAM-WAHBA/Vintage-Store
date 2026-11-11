import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();

const loadWishlist = (userId) => {
  const rows = db
    .prepare(
      `SELECT p.id, p.name, p.slug, p.description, p.price, p.quantity, p.image,
              p.featured, p.is_new, p.created_at,
              c.name AS category_name
       FROM wishlist_items w
       JOIN products p ON p.id = w.product_id
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
    )
    .all(userId);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    quantity: row.quantity,
    image: row.image,
    featured: !!row.featured,
    isNew: !!row.is_new,
    categories: row.category_name ? [row.category_name] : [],
    createdAt: row.created_at,
  }));
};

/* GET /api/wishlist — authenticated: current user's wishlist */
router.get("/", requireAuth, (req, res) => {
  res.json({ data: loadWishlist(req.user.id) });
});

/* POST /api/wishlist — authenticated: replace wishlist with provided product IDs (sync/merge helper) */
router.post("/", requireAuth, (req, res) => {
  const ids = Array.isArray(req.body?.productIds) ? req.body.productIds : null;
  if (!ids) return res.status(400).json({ error: "productIds array required." });
  const insert = db.prepare(
    "INSERT OR IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)",
  );
  const exists = db.prepare("SELECT id FROM products WHERE id = ?");
  const tx = db.transaction((userId, productIds) => {
    for (const id of productIds) {
      const pid = Number(id);
      if (!Number.isFinite(pid)) continue;
      if (!exists.get(pid)) continue;
      insert.run(userId, pid);
    }
  });
  tx(req.user.id, ids);
  res.json({ data: loadWishlist(req.user.id) });
});

/* POST /api/wishlist/toggle — authenticated: toggle a single product */
router.post("/toggle", requireAuth, (req, res) => {
  const productId = Number(req.body?.productId);
  if (!Number.isFinite(productId)) {
    return res.status(400).json({ error: "productId required." });
  }
  const product = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const existing = db
    .prepare("SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?")
    .get(req.user.id, productId);
  let added = false;
  if (existing) {
    db.prepare("DELETE FROM wishlist_items WHERE id = ?").run(existing.id);
  } else {
    db.prepare(
      "INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)",
    ).run(req.user.id, productId);
    added = true;
  }
  res.json({ data: { added, productId, wishlist: loadWishlist(req.user.id) } });
});

/* DELETE /api/wishlist/:productId — authenticated: remove item */
router.delete("/:productId", requireAuth, (req, res) => {
  const productId = Number(req.params.productId);
  db.prepare(
    "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?",
  ).run(req.user.id, productId);
  res.json({ data: loadWishlist(req.user.id) });
});

export default router;
