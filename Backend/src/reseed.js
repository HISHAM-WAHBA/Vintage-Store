/**
 * Wipes the catalog (products, categories, discount codes) and all orders,
 * then re-inserts the seed data. Users (incl. the admin account) are kept.
 *
 * Run with: npm run reseed
 *
 * Targets whatever `TURSO_DATABASE_URL` points to (local file by default).
 */
import { db, initDb } from "./db.js";
import { ensureSeed } from "./seed.js";

await initDb();

const statements = [
  { sql: "DELETE FROM order_items" },
  { sql: "DELETE FROM orders" },
  { sql: "DELETE FROM products" },
  { sql: "DELETE FROM categories" },
  { sql: "DELETE FROM discount_codes" },
];

await db.batch(statements);

// Restart AUTOINCREMENT counters so seeded rows keep predictable ids (1, 2, 3…).
try {
  await db.run(
    "DELETE FROM sqlite_sequence WHERE name IN ('orders', 'order_items', 'products', 'categories')",
  );
} catch {
  // sqlite_sequence only exists once an AUTOINCREMENT row was inserted.
}

// Forget the "showcase inserted" marker so the categories come back.
try {
  await db.run("DELETE FROM app_meta WHERE key = ?", ["showcase_categories_v1"]);
} catch {
  // ignore
}

await ensureSeed();
console.log("[reseed] Catalog restored to seed state. Existing orders were cleared.");
