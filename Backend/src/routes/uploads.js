import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { requireAdmin } from "../auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, "..", "..", "public", "images", "uploads");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = String(req.query.folder || "products").replace(/[^a-z0-9_-]/gi, "");
    const dir = path.join(uploadsRoot, folder || "products");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname || "") || ".jpg").toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].includes(ext)
      ? ext
      : ".jpg";
    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

const router = Router();

/* POST /api/uploads — admin: upload an image and get its served URL */
router.post("/", requireAdmin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }
    const folder = String(req.query.folder || "products").replace(/[^a-z0-9_-]/gi, "") || "products";
    const url = `/api/images/uploads/${folder}/${req.file.filename}`;
    res.status(201).json({ data: { url, filename: req.file.filename, folder } });
  });
});

export default router;
