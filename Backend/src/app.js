import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { initDb } from "./db.js";
import { ensureSeed } from "./seed.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import supportRoutes from "./routes/support.js";
import uploadRoutes from "./routes/uploads.js";
import wishlistRoutes from "./routes/wishlist.js";
import oauthRoutes from "./routes/oauth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createApp = () => {
  const app = express();

  // API responses are dynamic. An ETag + CDN revalidation produced 304 replies
  // without CORS headers on serverless, which blocked cross-origin browsers.
  app.set("etag", false);
  app.use((req, res, next) => {
    if (!req.path.startsWith("/api/images/")) {
      res.setHeader("Cache-Control", "no-store");
    }
    next();
  });

  app.use(
    cors({
      origin: config.corsOrigins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  // Self-hosted product imagery. Mounted under /api/images so the Vite dev
  // proxy (/api -> localhost:4000) serves it on the same origin — no CORS.
  // On Vercel these files are bundled via `includeFiles` in vercel.json.
  app.use(
    "/api/images",
    express.static(path.join(__dirname, "..", "public", "images"), {
      maxAge: "7d",
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "vintage-api" });
  });

  app.use("/api/auth", oauthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api", supportRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: "Endpoint not found." });
  });

  // Central error handler (JSON body errors, unexpected failures).
  app.use((err, req, res, _next) => {
    if (err.type === "entity.parse.failed" || err.status === 400) {
      return res.status(400).json({ error: "Invalid JSON payload." });
    }
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err.message);
    res.status(err.status || 500).json({
      error:
        err.status && err.status < 500 ? err.message : "Something went wrong.",
    });
  });

  return app;
};

let readyPromise = null;

/** Ensures the schema exists and seed data is present (memoized). */
export const ready = () =>
  (readyPromise ??= (async () => {
    await initDb();
    await ensureSeed();
    return true;
  })());
