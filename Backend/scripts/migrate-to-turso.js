/**
 * Copies the local SQLite database (Backend/data/vintage.db) into Turso.
 *
 * Requirements:
 *   TURSO_DATABASE_URL   e.g. libsql://vintage-<org>.turso.io
 *   TURSO_AUTH_TOKEN     token created with `turso db tokens create vintage`
 *
 * The local file is opened READ-ONLY and is never modified.
 *
 * Usage:
 *   node scripts/migrate-to-turso.js             copy (aborts if Turso has data)
 *   node scripts/migrate-to-turso.js --force     wipe Turso tables, then copy
 *   node scripts/migrate-to-turso.js --verify-only   only compare row counts
 *
 * Copy order respects foreign keys and preserves every id, so product,
 * order and user references stay intact.
 */
import "dotenv/config";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, "..");
const sourcePath =
  process.env.SOURCE_DB_PATH || path.join(backendRoot, "data", "vintage.db");

const force = process.argv.includes("--force");
const verifyOnly = process.argv.includes("--verify-only");

const TURSO_URL = String(process.env.TURSO_DATABASE_URL || "").trim();
if (!TURSO_URL) {
  console.error(
    [
      "TURSO_DATABASE_URL is not set.",
      "",
      "1. Create the database:   turso db create vintage",
      "2. Copy the URL:          turso db show vintage --url",
      "3. Create a token:        turso db tokens create vintage",
      "4. Put both in Backend/.env (never commit them):",
      "     TURSO_DATABASE_URL=libsql://vintage-<org>.turso.io",
      "     TURSO_AUTH_TOKEN=<token>",
      "5. Run again:             npm run db:migrate",
    ].join("\n"),
  );
  process.exit(1);
}
if (!process.env.TURSO_AUTH_TOKEN) {
  console.error("TURSO_AUTH_TOKEN is not set (see Backend/.env.example).");
  process.exit(1);
}
if (!fs.existsSync(sourcePath)) {
  console.error(`Local database not found at ${sourcePath}`);
  process.exit(1);
}

// Children first (used to wipe the remote before a forced copy).
const DELETE_ORDER = [
  "wishlist_items",
  "order_items",
  "orders",
  "products",
  "users",
  "categories",
  "discount_codes",
  "newsletter_subscribers",
  "contact_messages",
  "app_meta",
];

// Parents first (used to insert rows).
const COPY_ORDER = [
  "categories",
  "products",
  "users",
  "discount_codes",
  "orders",
  "order_items",
  "newsletter_subscribers",
  "contact_messages",
  "wishlist_items",
  "app_meta",
];

const source = new DatabaseSync(sourcePath, { readOnly: true });

const sourceTables = new Set(
  source
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    )
    .all()
    .map((row) => row.name),
);

const columnsOf = (table) =>
  source
    .prepare(`PRAGMA table_info("${table}")`)
    .all()
    .map((column) => column.name);

// `schema_version` is written by initDb() itself — it is not user data.
const countSql = (table) =>
  table === "app_meta"
    ? "SELECT COUNT(*) AS c FROM app_meta WHERE key != 'schema_version'"
    : `SELECT COUNT(*) AS c FROM "${table}"`;

const countOf = (table) => {
  try {
    return Number(source.prepare(countSql(table)).get().c);
  } catch {
    return 0;
  }
};

const tables = COPY_ORDER.filter((table) => sourceTables.has(table));
const localCounts = Object.fromEntries(tables.map((table) => [table, countOf(table)]));

const { db, initDb, SCHEMA_VERSION } = await import("../src/db.js");
await initDb();

const remoteCounts = {};
for (const table of tables) {
  try {
    const row = await db.get(countSql(table));
    remoteCounts[table] = Number(row?.c ?? 0);
  } catch {
    remoteCounts[table] = 0;
  }
}
const remoteTotal = Object.values(remoteCounts).reduce((a, b) => a + b, 0);

const printCounts = () => {
  console.log("table".padEnd(26) + "local".padStart(8) + "turso".padStart(8) + "  status");
  for (const table of tables) {
    const local = localCounts[table];
    const remote = remoteCounts[table];
    console.log(
      table.padEnd(26) +
        String(local).padStart(8) +
        String(remote).padStart(8) +
        "  " +
        (local === remote ? "ok" : "MISMATCH"),
    );
  }
};

if (verifyOnly) {
  printCounts();
  const ok = tables.every((table) => localCounts[table] === remoteCounts[table]);
  console.log(ok ? "\nVerification passed." : "\nVerification FAILED.");
  process.exit(ok ? 0 : 1);
}

if (remoteTotal > 0 && !force) {
  console.error(
    [
      "",
      `Turso already contains ${remoteTotal} rows. Nothing was changed.`,
      "Run with --force to wipe the remote tables and copy the local data again.",
      "",
    ].join("\n"),
  );
  printCounts();
  process.exit(1);
}

if (force) {
  console.log("Wiping Turso tables (--force)…");
  await db.batch(DELETE_ORDER.map((table) => ({ sql: `DELETE FROM "${table}"` })));
}

const CHUNK = 100;
const copyTable = async (table) => {
  const columns = columnsOf(table);
  if (columns.length === 0) return 0;
  const rows = source.prepare(`SELECT * FROM "${table}"`).all();
  if (rows.length === 0) return 0;

  const quoted = columns.map((column) => `"${column}"`).join(", ");
  const placeholders = columns.map(() => "?").join(", ");
  const sql = `INSERT OR REPLACE INTO "${table}" (${quoted}) VALUES (${placeholders})`;

  for (let offset = 0; offset < rows.length; offset += CHUNK) {
    const chunk = rows.slice(offset, offset + CHUNK);
    await db.batch(
      chunk.map((row) => ({ sql, args: columns.map((column) => row[column] ?? null) })),
    );
    process.stdout.write(`\r  ${table}: ${Math.min(offset + CHUNK, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
  return rows.length;
};

console.log(`Copying ${sourcePath}\n→ ${TURSO_URL}\n`);
for (const table of tables) {
  await copyTable(table);
}

// Keep the schema marker in sync with the code that just created the schema.
await db.run(
  "INSERT INTO app_meta (key, value) VALUES ('schema_version', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  [String(SCHEMA_VERSION)],
);

console.log("\nVerifying…");
for (const table of tables) {
  const row = await db.get(countSql(table));
  remoteCounts[table] = Number(row?.c ?? 0);
}
console.log("(app_meta counts exclude the internal schema_version marker)");
printCounts();

const admin = await db.get("SELECT email, role FROM users WHERE role = 'admin' LIMIT 1");
const sample = await db.get("SELECT id, name, price FROM products ORDER BY id LIMIT 1");

console.log(
  `\nAdmin account: ${admin ? `${admin.email} (${admin.role})` : "MISSING"}`,
);
console.log(
  `Sample product: ${sample ? `#${sample.id} ${sample.name} — ${sample.price}` : "MISSING"}`,
);

const ok = tables.every((table) => localCounts[table] === remoteCounts[table]);
source.close();
console.log(ok ? "\nMigration complete." : "\nMigration finished with MISMATCHES — check above.");
process.exit(ok ? 0 : 1);
