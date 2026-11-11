import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./src/config.js";
import "./src/db.js";
import { ensureSeed } from "./src/seed.js";
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import categoryRoutes from "./src/routes/categories.js";
import orderRoutes from "./src/routes/orders.js";
import userRoutes from "./src/routes/users.js";
import supportRoutes from "./src/routes/support.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(
  cors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json({ limit: "1mb" }));

// Self-hosted product imagery. Mounted under /api/images so the Vite dev
// proxy (/api -> localhost:4000) serves it on the same origin — no CORS.
app.use(
  "/api/images",
  express.static(path.join(__dirname, "public", "images"), {
    maxAge: "7d",
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "vintage-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
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
    error: err.status && err.status < 500 ? err.message : "Something went wrong.",
  });
});

ensureSeed();

app.listen(config.port, () => {
  console.log(`Vintage API listening on http://localhost:${config.port}`);
});
