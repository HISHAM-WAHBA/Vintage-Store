import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";
import { slugify } from "../utils.js";

const router = Router();

const listQuery = `
  SELECT c.id, c.name, c.slug, c.description, c.image,
         (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
  FROM categories c
`;

const toCategory = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  image: row.image,
  productCount: row.product_count,
});

/* GET /api/categories — public listing */
router.get("/", (_req, res) => {
  const rows = db.prepare(`${listQuery} ORDER BY c.name ASC`).all();
  res.json({ data: rows.map(toCategory) });
});

/* POST /api/categories — admin: create */
router.post("/", requireAdmin, (req, res) => {
  const name = String((req.body || {}).name || "").trim();
  if (name.length < 2) {
    return res.status(400).json({ error: "Category name is required." });
  }
  const slug = slugify(name);
  const exists = db
    .prepare("SELECT id FROM categories WHERE name = ? OR slug = ?")
    .get(name, slug);
  if (exists) {
    return res.status(409).json({ error: "This category already exists." });
  }
  const result = db
    .prepare("INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)")
    .run(
      name,
      slug,
      String((req.body || {}).description || ""),
      String((req.body || {}).image || ""),
    );
  const row = db
    .prepare(`${listQuery} WHERE c.id = ?`)
    .get(Number(result.lastInsertRowid));
  res.status(201).json({ data: toCategory(row) });
});

/* DELETE /api/categories/:id — admin: delete (products move to another category) */
router.delete("/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id) || 0;
  const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Category not found." });

  const replacement = db
    .prepare("SELECT id FROM categories WHERE id != ? ORDER BY id LIMIT 1")
    .get(id);

  db.exec("BEGIN");
  try {
    db.prepare("UPDATE products SET category_id = ? WHERE category_id = ?").run(
      replacement ? replacement.id : null,
      id,
    );
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  res.json({ data: { deleted: true, id } });
});

export default router;
