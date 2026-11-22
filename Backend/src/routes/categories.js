import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";
import { slugify, wrap } from "../utils.js";

const router = Router();

const listQuery = `
  SELECT c.id, c.name, c.slug, c.description, c.image, c.subtitle, c.sort_order,
         (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
  FROM categories c
`;

const toCategory = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  image: row.image,
  subtitle: row.subtitle || "",
  sortOrder: row.sort_order || 0,
  productCount: row.product_count,
});

/* GET /api/categories — public listing (showcase order first) */
router.get(
  "/",
  wrap(async (_req, res) => {
    const rows = await db.all(
      `${listQuery}
       ORDER BY CASE WHEN c.sort_order > 0 THEN 0 ELSE 1 END,
                c.sort_order ASC, c.name ASC`,
    );
    res.json({ data: rows.map(toCategory) });
  }),
);

/* POST /api/categories — admin: create */
router.post(
  "/",
  requireAdmin,
  wrap(async (req, res) => {
    const name = String((req.body || {}).name || "").trim();
    if (name.length < 2) {
      return res.status(400).json({ error: "Category name is required." });
    }
    const slug = slugify(name);
    const exists = await db.get(
      "SELECT id FROM categories WHERE name = ? OR slug = ?",
      [name, slug],
    );
    if (exists) {
      return res.status(409).json({ error: "This category already exists." });
    }
    const result = await db.run(
      `INSERT INTO categories (name, slug, description, image, subtitle, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        String((req.body || {}).description || ""),
        String((req.body || {}).image || ""),
        String((req.body || {}).subtitle || ""),
        Number((req.body || {}).sortOrder) || 0,
      ],
    );
    const row = await db.get(`${listQuery} WHERE c.id = ?`, [
      result.lastInsertRowid,
    ]);
    res.status(201).json({ data: toCategory(row) });
  }),
);

/* DELETE /api/categories/:id — admin: delete (products move to another category) */
router.delete(
  "/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id) || 0;
    const row = await db.get("SELECT * FROM categories WHERE id = ?", [id]);
    if (!row) return res.status(404).json({ error: "Category not found." });

    const replacement = await db.get(
      "SELECT id FROM categories WHERE id != ? ORDER BY id LIMIT 1",
      [id],
    );

    await db.batch([
      {
        sql: "UPDATE products SET category_id = ? WHERE category_id = ?",
        args: [replacement ? replacement.id : null, id],
      },
      { sql: "DELETE FROM categories WHERE id = ?", args: [id] },
    ]);

    res.json({ data: { deleted: true, id } });
  }),
);

export default router;
