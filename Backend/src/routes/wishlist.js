import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import { wrap } from "../utils.js";

const router = Router();

const loadWishlist = async (userId) => {
  const rows = await db.all(
    `SELECT p.id, p.name, p.slug, p.description, p.price, p.quantity, p.image,
            p.featured, p.is_new, p.created_at,
            c.name AS category_name
     FROM wishlist_items w
     JOIN products p ON p.id = w.product_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`,
    [userId],
  );
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
router.get(
  "/",
  requireAuth,
  wrap(async (req, res) => {
    res.json({ data: await loadWishlist(req.user.id) });
  }),
);

/* POST /api/wishlist — authenticated: add provided product IDs (sync helper) */
router.post(
  "/",
  requireAuth,
  wrap(async (req, res) => {
    const ids = Array.isArray(req.body?.productIds) ? req.body.productIds : null;
    if (!ids) return res.status(400).json({ error: "productIds array required." });

    const productIds = [
      ...new Set(
        ids
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0),
      ),
    ];

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => "?").join(", ");
      const existing = await db.all(
        `SELECT id FROM products WHERE id IN (${placeholders})`,
        productIds,
      );
      const valid = new Set(existing.map((row) => row.id));
      await db.batch(
        productIds
          .filter((id) => valid.has(id))
          .map((id) => ({
            sql: "INSERT OR IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)",
            args: [req.user.id, id],
          })),
      );
    }

    res.json({ data: await loadWishlist(req.user.id) });
  }),
);

/* POST /api/wishlist/toggle — authenticated: toggle a single product */
router.post(
  "/toggle",
  requireAuth,
  wrap(async (req, res) => {
    const productId = Number(req.body?.productId);
    if (!Number.isFinite(productId)) {
      return res.status(400).json({ error: "productId required." });
    }
    const product = await db.get("SELECT id FROM products WHERE id = ?", [
      productId,
    ]);
    if (!product) return res.status(404).json({ error: "Product not found." });

    const existing = await db.get(
      "SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?",
      [req.user.id, productId],
    );
    let added = false;
    if (existing) {
      await db.run("DELETE FROM wishlist_items WHERE id = ?", [existing.id]);
    } else {
      await db.run(
        "INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)",
        [req.user.id, productId],
      );
      added = true;
    }
    res.json({
      data: {
        added,
        productId,
        wishlist: await loadWishlist(req.user.id),
      },
    });
  }),
);

/* DELETE /api/wishlist/:productId — authenticated: remove item */
router.delete(
  "/:productId",
  requireAuth,
  wrap(async (req, res) => {
    const productId = Number(req.params.productId);
    await db.run(
      "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?",
      [req.user.id, productId],
    );
    res.json({ data: await loadWishlist(req.user.id) });
  }),
);

export default router;
