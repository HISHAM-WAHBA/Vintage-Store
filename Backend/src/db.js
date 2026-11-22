import "dotenv/config";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Database layer for the Vintage API.
 *
 * Two modes, one code path:
 *  - Local/dev  → SQLite file at Backend/data/vintage.db (`file:` URL).
 *  - Production → Turso Cloud (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`).
 *
 * Both use the official `@libsql/client` driver. Statements are always
 * awaited (the driver is async), and multi-statement work that must be
 * atomic goes through `db.batch(...)` (a single round trip on Turso).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const localDbPath = path.join(dataDir, "vintage.db");

/** Bump when the schema below changes; see `runMigrations`. */
export const SCHEMA_VERSION = 2;

const remoteUrl = String(process.env.TURSO_DATABASE_URL || "").trim();
const authToken = String(process.env.TURSO_AUTH_TOKEN || "").trim();

// libSQL/HTTP URLs (Turso) use the network-only build. A `file:` URL is also
// accepted so `scripts/migrate-to-turso.js` can be rehearsed locally.
const isHttpUrl = /^(libsql|https?):/i.test(remoteUrl);

export const dbMode = remoteUrl ? (isHttpUrl ? "turso" : "file") : "local";

let clientPromise = null;

const createClientAsync = async () => {
  if (remoteUrl) {
    // HTTP-only build: no native bindings, works in serverless runtimes.
    const { createClient } = await import(
      isHttpUrl ? "@libsql/client/web" : "@libsql/client"
    );
    const client = createClient({
      url: remoteUrl,
      authToken: authToken || undefined,
    });
    console.log(
      isHttpUrl
        ? `[db] Connected to Turso (${remoteUrl.replace(/\/\/.*@/, "//")})`
        : `[db] Using target file (${remoteUrl})`,
    );
    return client;
  }
  mkdirSync(dataDir, { recursive: true });
  const { createClient } = await import("@libsql/client");
  // Windows paths need forward slashes inside a file: URL.
  const client = createClient({ url: `file:${localDbPath.replace(/\\/g, "/")}` });
  console.log(`[db] Using local SQLite file (${localDbPath})`);
  return client;
};

const getClient = () => (clientPromise ??= createClientAsync());

const toError = (sql, error) => {
  const wrapped = new Error(`Database error: ${error.message}`);
  wrapped.cause = error;
  wrapped.sql = sql;
  return wrapped;
};

/**
 * Thin async adapter. Keeps the call sites close to the previous API:
 *   db.prepare(sql).get(a, b)  →  await db.get(sql, [a, b])
 *   db.prepare(sql).all(a)     →  await db.all(sql, [a])
 *   db.prepare(sql).run(a)     →  await db.run(sql, [a])
 *   BEGIN/COMMIT block         →  await db.batch([{ sql, args }, ...])
 */
export const db = {
  mode: dbMode,

  async all(sql, args = []) {
    const client = await getClient();
    try {
      const result = await client.execute({ sql, args });
      return result.rows;
    } catch (error) {
      throw toError(sql, error);
    }
  },

  async get(sql, args = []) {
    const rows = await db.all(sql, args);
    return rows[0];
  },

  async run(sql, args = []) {
    const client = await getClient();
    try {
      const result = await client.execute({ sql, args });
      return {
        lastInsertRowid: Number(result.lastInsertRowid ?? 0),
        changes: Number(result.rowsAffected ?? 0),
      };
    } catch (error) {
      throw toError(sql, error);
    }
  },

  /** Executes many statements atomically, in a single round trip on Turso. */
  async batch(statements, mode = "write") {
    const client = await getClient();
    const list = (statements || []).filter(Boolean);
    if (list.length === 0) return [];
    try {
      return await client.batch(list, mode);
    } catch (error) {
      throw toError("batch", error);
    }
  },

  /** Multi-statement DDL only (no parameters). */
  async exec(sql) {
    const client = await getClient();
    try {
      await client.executeMultiple(sql);
    } catch (error) {
      throw toError("exec", error);
    }
  },
};

/* ── Schema ─────────────────────────────────────────────────────────────── */

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS app_meta (
     key   TEXT PRIMARY KEY,
     value TEXT NOT NULL DEFAULT ''
   );`,

  `CREATE TABLE IF NOT EXISTS categories (
     id          INTEGER PRIMARY KEY AUTOINCREMENT,
     name        TEXT    NOT NULL UNIQUE,
     slug        TEXT    NOT NULL UNIQUE,
     description TEXT    NOT NULL DEFAULT '',
     image       TEXT    NOT NULL DEFAULT '',
     subtitle    TEXT    NOT NULL DEFAULT '',
     sort_order  INTEGER NOT NULL DEFAULT 0
   );`,

  `CREATE TABLE IF NOT EXISTS products (
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
   );`,

  `CREATE TABLE IF NOT EXISTS users (
     id            INTEGER PRIMARY KEY AUTOINCREMENT,
     name          TEXT    NOT NULL,
     email         TEXT    NOT NULL UNIQUE,
     password_hash TEXT,
     role          TEXT    NOT NULL DEFAULT 'customer',
     phone         TEXT    NOT NULL DEFAULT '',
     address       TEXT    NOT NULL DEFAULT '',
     provider      TEXT    NOT NULL DEFAULT 'local',
     provider_id   TEXT,
     avatar        TEXT    NOT NULL DEFAULT '',
     created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
   );`,

  `CREATE TABLE IF NOT EXISTS discount_codes (
     code    TEXT PRIMARY KEY,
     percent REAL NOT NULL,
     active  INTEGER NOT NULL DEFAULT 1
   );`,

  `CREATE TABLE IF NOT EXISTS orders (
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
   );`,

  `CREATE TABLE IF NOT EXISTS order_items (
     id         INTEGER PRIMARY KEY AUTOINCREMENT,
     order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
     product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
     name       TEXT    NOT NULL,
     price      REAL    NOT NULL,
     image      TEXT    NOT NULL DEFAULT '',
     quantity   INTEGER NOT NULL
   );`,

  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
     id         INTEGER PRIMARY KEY AUTOINCREMENT,
     email      TEXT    NOT NULL UNIQUE,
     created_at TEXT    NOT NULL DEFAULT (datetime('now'))
   );`,

  `CREATE TABLE IF NOT EXISTS contact_messages (
     id         INTEGER PRIMARY KEY AUTOINCREMENT,
     name       TEXT    NOT NULL,
     email      TEXT    NOT NULL,
     subject    TEXT    NOT NULL DEFAULT '',
     message    TEXT    NOT NULL,
     is_read    INTEGER NOT NULL DEFAULT 0,
     created_at TEXT    NOT NULL DEFAULT (datetime('now'))
   );`,

  `CREATE TABLE IF NOT EXISTS wishlist_items (
     id         INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
     created_at TEXT    NOT NULL DEFAULT (datetime('now')),
     UNIQUE(user_id, product_id)
   );`,

  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);`,
  `CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_id);`,
];

/** Idempotent `ALTER TABLE ... ADD COLUMN` (fails silently when present). */
const ensureColumn = async (table, column, definition) => {
  try {
    await db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  } catch {
    // column already exists
  }
};

/**
 * Old databases had `password_hash NOT NULL`, which blocks OAuth-only users.
 * Rebuild the table when needed (runs once).
 */
const migrateUsersNullablePassword = async () => {
  try {
    const columns = await db.all("PRAGMA table_info(users)");
    const password = columns.find((column) => column.name === "password_hash");
    if (!password || Number(password.notnull) !== 1) return;

    await db.exec(`
      CREATE TABLE users_new (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT    NOT NULL,
        email         TEXT    NOT NULL UNIQUE,
        password_hash TEXT,
        role          TEXT    NOT NULL DEFAULT 'customer',
        phone         TEXT    NOT NULL DEFAULT '',
        address       TEXT    NOT NULL DEFAULT '',
        provider      TEXT    NOT NULL DEFAULT 'local',
        provider_id   TEXT,
        avatar        TEXT    NOT NULL DEFAULT '',
        created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
      );
      INSERT INTO users_new (id, name, email, password_hash, role, phone, address, provider, provider_id, avatar, created_at)
        SELECT id, name, email, password_hash, role, phone, address,
               COALESCE(provider, 'local'), provider_id, COALESCE(avatar, ''), created_at
        FROM users;
      DROP TABLE users;
      ALTER TABLE users_new RENAME TO users;
    `);
    console.log("[db] Migrated users.password_hash to nullable");
  } catch (error) {
    console.warn("[db] users password migration skipped:", error.message);
  }
};

const currentVersion = async () => {
  try {
    const row = await db.get(
      "SELECT value FROM app_meta WHERE key = ?",
      ["schema_version"],
    );
    return row ? Number(row.value) || 0 : 0;
  } catch {
    return 0; // app_meta does not exist yet
  }
};

const runMigrations = async () => {
  const version = await currentVersion();

  if (version < SCHEMA_VERSION) {
    await db.batch(SCHEMA_STATEMENTS.map((sql) => ({ sql })));

    await ensureColumn("users", "provider", "TEXT NOT NULL DEFAULT 'local'");
    await ensureColumn("users", "provider_id", "TEXT");
    await ensureColumn("users", "avatar", "TEXT NOT NULL DEFAULT ''");
    await ensureColumn("categories", "subtitle", "TEXT NOT NULL DEFAULT ''");
    await ensureColumn("categories", "sort_order", "INTEGER NOT NULL DEFAULT 0");

    await migrateUsersNullablePassword();

    await db.run(
      "INSERT INTO app_meta (key, value) VALUES ('schema_version', ?) " +
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [String(SCHEMA_VERSION)],
    );
    console.log(`[db] Schema ready (version ${SCHEMA_VERSION})`);
  }

  // Only meaningful for the embedded local connection.
  if (!remoteUrl) {
    try {
      await db.exec("PRAGMA foreign_keys = ON");
    } catch {
      // older builds: pragmas are best-effort
    }
  }
};

let initPromise = null;

/** Resolves once the schema is in place (memoized per process/cold start). */
export const initDb = () => (initPromise ??= runMigrations());
