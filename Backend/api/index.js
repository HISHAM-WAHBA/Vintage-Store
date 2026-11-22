import { createApp, ready } from "../src/app.js";

/**
 * Vercel serverless entry point.
 *
 * All requests are rewritten to this function (see Backend/vercel.json).
 * Vercel preserves the incoming path in `req.url`, but we normalise a few
 * shapes defensively so the Express router always sees `/api/...`.
 */
const app = createApp();

const normalizeUrl = (url = "/") => {
  let next = url || "/";

  // `/api/index` or `/api/index?...` → `/api...`
  if (next === "/api/index" || next.startsWith("/api/index?")) {
    next = next.slice("/api/index".length) || "/";
  }

  // Root or bare paths → keep everything under the /api prefix.
  if (!next.startsWith("/api") && next !== "/api") {
    next = `/api${next.startsWith("/") ? "" : "/"}${next}`;
  }

  return next.startsWith("/api") ? next : "/api";
};

export default async function handler(req, res) {
  try {
    await ready();
    req.url = normalizeUrl(req.url);
    return app(req, res);
  } catch (error) {
    console.error("[api] fatal:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
    }
    res.end(
      JSON.stringify({
        error: "The API could not start. Check the server logs and database settings.",
      }),
    );
  }
}
