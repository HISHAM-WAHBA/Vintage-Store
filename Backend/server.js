import { createApp, ready } from "./src/app.js";
import { config } from "./src/config.js";
import { db } from "./src/db.js";

/**
 * Local / long-running entry point.
 * On Vercel the API is served by `api/index.js` instead (no app.listen).
 */
const app = createApp();

const start = async () => {
  await ready();
  app.listen(config.port, () => {
    console.log(`Vintage API listening on http://localhost:${config.port}`);
    console.log(`[db] mode: ${db.mode}`);
  });
};

start().catch((error) => {
  console.error("[boot] failed:", error);
  process.exit(1);
});
