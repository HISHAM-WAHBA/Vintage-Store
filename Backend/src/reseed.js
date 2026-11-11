/**
 * Wipes the catalog (products, categories, discount codes) and all orders,
 * then re-inserts the seed data. Users (incl. the admin account) are kept.
 *
 * Run with: npm run reseed
 */
import { db } from "./db.js";
import { ensureSeed } from "./seed.js";

db.exec("BEGIN");
try {
  db.exec("DELETE FROM order_items");
  db.exec("DELETE FROM orders");
  db.exec("DELETE FROM products");
  db.exec("DELETE FROM categories");
  db.exec("DELETE FROM discount_codes");
  // Restart id counters so seeded rows keep predictable ids (1, 2, 3, …).
  db.exec(
    "DELETE FROM sqlite_sequence WHERE name IN ('orders', 'order_items', 'products', 'categories', 'discount_codes')",
  );
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

ensureSeed();
console.log("[reseed] Catalog restored to seed state. Existing orders were cleared.");
