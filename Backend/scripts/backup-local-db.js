/**
 * Creates a timestamped backup of the local SQLite database:
 *   Backend/data/backups/<stamp>/vintage.db      (binary copy)
 *   Backend/data/backups/<stamp>/<table>.json    (readable dump per table)
 *
 * The live database is opened read-only and never modified.
 *
 * Usage: npm run db:backup
 */
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, "..");
const sourcePath = path.join(backendRoot, "data", "vintage.db");

if (!fs.existsSync(sourcePath)) {
  console.error(`No local database found at ${sourcePath}`);
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = path.join(backendRoot, "data", "backups", stamp);
fs.mkdirSync(outDir, { recursive: true });

fs.copyFileSync(sourcePath, path.join(outDir, "vintage.db"));

const db = new DatabaseSync(sourcePath, { readOnly: true });
const tables = db
  .prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  )
  .all()
  .map((row) => row.name);

const summary = {};
for (const table of tables) {
  const rows = db.prepare(`SELECT * FROM "${table}"`).all();
  summary[table] = rows.length;
  fs.writeFileSync(
    path.join(outDir, `${table}.json`),
    JSON.stringify(rows, null, 2),
  );
}

db.close();

console.log(`Backup written to ${outDir}`);
for (const [table, count] of Object.entries(summary)) {
  console.log(`  ${table.padEnd(24)} ${count}`);
}
