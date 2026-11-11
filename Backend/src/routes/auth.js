import { Router } from "express";
import { db } from "../db.js";
import {
  hashPassword,
  verifyPassword,
  signToken,
  publicUser,
  requireAuth,
} from "../auth.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* POST /api/auth/register */
router.post("/register", (req, res) => {
  const { name = "", email = "", password = "" } = req.body || {};
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();

  if (cleanName.length < 2) {
    return res.status(400).json({ error: "Please tell us your name." });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (String(password).length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(cleanEmail);
  if (existing) {
    return res
      .status(409)
      .json({ error: "An account with this email already exists." });
  }

  const result = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(cleanName, cleanEmail, hashPassword(String(password)));

  const row = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(Number(result.lastInsertRowid));
  const user = publicUser(row);
  res.status(201).json({ token: signToken(user), user });
});

/* POST /api/auth/login */
router.post("/login", (req, res) => {
  const { email = "", password = "" } = req.body || {};
  const cleanEmail = String(email).trim().toLowerCase();

  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(cleanEmail);
  if (!row || !verifyPassword(String(password), row.password_hash)) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const user = publicUser(row);
  res.json({ token: signToken(user), user });
});

/* GET /api/auth/me */
router.get("/me", requireAuth, (req, res) => {
  res.json({ data: req.user });
});

/* PUT /api/auth/me — update profile details */
router.put("/me", requireAuth, (req, res) => {
  const { name, phone, address } = req.body || {};
  const nextName = name != null ? String(name).trim() : req.user.name;
  if (nextName.length < 2) {
    return res.status(400).json({ error: "Name is too short." });
  }
  db.prepare("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?").run(
    nextName,
    phone != null ? String(phone).trim() : req.user.phone,
    address != null ? String(address).trim() : req.user.address,
    req.user.id,
  );
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  res.json({ data: publicUser(row) });
});

export default router;
