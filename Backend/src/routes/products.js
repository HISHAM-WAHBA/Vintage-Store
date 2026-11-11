import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";
import { slugify } from "../utils.js";

const router = Router();

const PRODUCT_SELECT = `
  SELECT p.id, p.name, p.slug, p.description, p.price, p.quantity, p.image,
         p.featured, p.is_new, p.created_at,
         c.id AS category_id, c.name AS category_name, c.slug AS category_slug
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

const toProduct = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  price: row.price,
  quantity: row.quantity,
  image: row.image,
  featured: !!row.featured,
  isNew: !!row.is_new,
  createdAt: row.created_at,
  category: row.category_id
    ? { id: row.category_id, name: row.category_name, slug: row.category_slug }
    : null,
  /** Convenience array of category names (matches what the storefront expects). */
  categories: row.category_name ? [row.category_name] : [],
});

const findRow = (idOrSlug) =>
  /^\d+$/.test(idOrSlug)
    ? db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(Number(idOrSlug))
    : db.prepare(`${PRODUCT_SELECT} WHERE p.slug = ?`).get(idOrSlug);

const uniqueSlug = (name, excludeId = null) => {
  const base = slugify(name) || `item-${Date.now()}`;
  let candidate = base;
  let counter = 2;
  for (;;) {
    const row = excludeId
      ? db
          .prepare("SELECT id FROM products WHERE slug = ? AND id != ?")
          .get(candidate, excludeId)
      : db.prepare("SELECT id FROM products WHERE slug = ?").get(candidate);
    if (!row) return candidate;
    candidate = `${base}-${counter++}`;
  }
};

const resolveCategoryId = (value) => {
  if (value == null || value === "") return null;
  const key = String(value);
  const row = /^\d+$/.test(key)
    ? db.prepare("SELECT id FROM categories WHERE id = ?").get(Number(key))
    : db
        .prepare("SELECT id FROM categories WHERE name = ? OR slug = ?")
        .get(key, key);
  return row ? row.id : null;
};

/* GET /api/products — public catalog listing */
router.get("/", (_req, res) => {
  const rows = db
    .prepare(`${PRODUCT_SELECT} ORDER BY p.featured DESC, p.id DESC`)
    .all();
  res.json({ data: rows.map(toProduct) });
});

/* GET /api/products/:idOrSlug — single product */
router.get("/:idOrSlug", (req, res) => {
  const row = findRow(String(req.params.idOrSlug));
  if (!row) return res.status(404).json({ error: "Product not found." });
  res.json({ data: toProduct(row) });
});

/* POST /api/products — admin: create */
router.post("/", requireAdmin, (req, res) => {
  const {
    name,
    description = "",
    price,
    quantity = 0,
    image = "",
    featured = false,
    isNew = false,
    category = null,
  } = req.body || {};

  const cleanName = String(name || "").trim();
  if (cleanName.length < 2) {
    return res.status(400).json({ error: "Product name is required." });
  }
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: "Please provide a valid price." });
  }

  const result = db
    .prepare(
      `INSERT INTO products
        (name, slug, description, price, quantity, image, featured, is_new, category_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      cleanName,
      uniqueSlug(cleanName),
      String(description),
      numericPrice,
      Math.max(0, Math.trunc(Number(quantity) || 0)),
      String(image || ""),
      featured ? 1 : 0,
      isNew ? 1 : 0,
      resolveCategoryId(category),
      new Date().toISOString(),
    );

  res.status(201).json({ data: toProduct(findRow(String(Number(result.lastInsertRowid)))) });
});

/* PUT /api/products/:id — admin: update */
router.put("/:id", requireAdmin, (req, res) => {
  const existing = findRow(String(req.params.id));
  if (!existing) return res.status(404).json({ error: "Product not found." });

  const { name, description, price, quantity, image, featured, isNew, category } =
    req.body || {};

  const nextName =
    name != null ? String(name).trim() : existing.name;
  if (nextName.length < 2) {
    return res.status(400).json({ error: "Product name is too short." });
  }
  const nextPrice = price != null ? Number(price) : existing.price;
  if (!Number.isFinite(nextPrice) || nextPrice < 0) {
    return res.status(400).json({ error: "Please provide a valid price." });
  }

  const slug =
    nextName === existing.name ? existing.slug : uniqueSlug(nextName, existing.id);

  db.prepare(
    `UPDATE products
       SET name = ?, slug = ?, description = ?, price = ?, quantity = ?,
           image = ?, featured = ?, is_new = ?, category_id = ?
     WHERE id = ?`,
  ).run(
    nextName,
    slug,
    description != null ? String(description) : existing.description,
    nextPrice,
    quantity != null
      ? Math.max(0, Math.trunc(Number(quantity) || 0))
      : existing.quantity,
    image != null ? String(image) : existing.image,
    featured != null ? (featured ? 1 : 0) : existing.featured,
    isNew != null ? (isNew ? 1 : 0) : existing.is_new,
    category !== undefined ? resolveCategoryId(category) : existing.category_id,
    existing.id,
  );

  res.json({ data: toProduct(findRow(String(existing.id))) });
});

/* DELETE /api/products/:id — admin: delete */
router.delete("/:id", requireAdmin, (req, res) => {
  const existing = findRow(String(req.params.id));
  if (!existing) return res.status(404).json({ error: "Product not found." });
  db.prepare("DELETE FROM products WHERE id = ?").run(existing.id);
  res.json({ data: { deleted: true, id: existing.id } });
});

export default router;
