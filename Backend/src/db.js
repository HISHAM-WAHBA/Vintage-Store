import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

/**
 * SQLite database (single file at Backend/data/vintage.db).
 * Uses Node's built-in `node:sqlite` module — no native deps to install.
 */
export const db = new DatabaseSync(path.join(dataDir, "vintage.db"));

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT    NOT NULL DEFAULT '',
    image       TEXT    NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT    NOT NULL DEFAULT '',
    price       REAL    NOT NULL DEFAULT 0,
    quantity    INTEGER NOT NULL DEFAULT 0,
    image       TEXT    NOT NULL DEFAULT '',
    featured    INTEGER NOT NULL DEFAULT 0,
    is_new      INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    role          TEXT    NOT NULL DEFAULT 'customer',
    phone         TEXT    NOT NULL DEFAULT '',
    address       TEXT    NOT NULL DEFAULT '',
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS discount_codes (
    code    TEXT PRIMARY KEY,
    percent REAL NOT NULL,
    active  INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS orders (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    code           TEXT UNIQUE,
    user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    customer_json  TEXT    NOT NULL,
    payment_method TEXT    NOT NULL DEFAULT 'cash',
    status         TEXT    NOT NULL DEFAULT 'Processing',
    subtotal       REAL    NOT NULL,
    shipping       REAL    NOT NULL,
    discount_code  TEXT,
    discount_amount REAL   NOT NULL DEFAULT 0,
    total          REAL    NOT NULL,
    created_at     TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    name       TEXT    NOT NULL,
    price      REAL    NOT NULL,
    image      TEXT    NOT NULL DEFAULT '',
    quantity   INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`);
