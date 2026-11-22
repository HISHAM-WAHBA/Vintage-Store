import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { config } from "../config.js";
import { requireAdmin } from "../auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, "..", "..", "public", "images", "uploads");

const useCloudinary = config.cloudinary.enabled;
const isServerless = Boolean(process.env.VERCEL);

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

/**
 * Local development keeps writing into Backend/public/images/uploads.
 * Production (serverless) must not rely on that filesystem, so files are
 * streamed to Cloudinary instead (memory storage → upload → CDN URL).
 */
const diskStorage = multer.diskStorage({
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
  storage: useCloudinary || isServerless ? multer.memoryStorage() : diskStorage,
  // Vercel caps request bodies at ~4.5 MB, so keep a little headroom.
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

/** Uploads a buffer to Cloudinary using the REST API (no extra dependency). */
const uploadToCloudinary = async (file, folder) => {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  const timestamp = Math.floor(Date.now() / 1000);
  // Signed parameters must be sorted alphabetically: folder, timestamp.
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const form = new FormData();
  form.append(
    "file",
    new Blob([file.buffer], { type: file.mimetype }),
    file.originalname || "upload",
  );
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.secure_url) {
    throw new Error(
      payload?.error?.message || `Cloudinary upload failed (${response.status}).`,
    );
  }
  return {
    url: payload.secure_url,
    filename: payload.public_id,
    provider: "cloudinary",
  };
};

const router = Router();

/* POST /api/uploads — admin: upload an image and get its served URL */
router.post("/", requireAdmin, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message || "Upload failed." });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided." });
      }

      const folderName =
        String(req.query.folder || "products").replace(/[^a-z0-9_-]/gi, "") ||
        "products";

      if (useCloudinary) {
        const stored = await uploadToCloudinary(req.file, `vintage/${folderName}`);
        return res.status(201).json({
          data: { url: stored.url, filename: stored.filename, folder: folderName, provider: stored.provider },
        });
      }

      if (isServerless) {
        return res.status(503).json({
          error:
            "Image storage is not configured on this deployment. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or paste an image URL instead.",
        });
      }

      return res.status(201).json({
        data: {
          url: `/api/images/uploads/${folderName}/${req.file.filename}`,
          filename: req.file.filename,
          folder: folderName,
          provider: "local",
        },
      });
    } catch (error) {
      console.error("[uploads]", error.message);
      return res.status(502).json({ error: error.message || "Upload failed." });
    }
  });
});

export default router;
