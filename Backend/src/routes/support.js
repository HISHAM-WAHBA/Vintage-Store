import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Newsletter ──────────────────────────────────────────────────────────── */

/* POST /api/newsletter — public: subscribe an email address */
router.post("/newsletter", (req, res) => {
  const email = String((req.body || {}).email || "")
    .trim()
    .toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }
  db.prepare(
    "INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)",
  ).run(email);
  res.status(201).json({ data: { subscribed: true, email } });
});

/* GET /api/newsletter — admin: list subscribers */
router.get("/newsletter", requireAdmin, (_req, res) => {
  const rows = db
    .prepare("SELECT id, email, created_at FROM newsletter_subscribers ORDER BY id DESC")
    .all();
  res.json({ data: rows.map((row) => ({ ...row, createdAt: row.created_at })) });
});

/* ── Contact messages ───────────────────────────────────────────────────── */

/* POST /api/contact — public: submit the contact form */
router.post("/contact", (req, res) => {
  const { name = "", email = "", subject = "", message = "" } = req.body || {};
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanSubject = String(subject).trim();
  const cleanMessage = String(message).trim();

  if (cleanName.length < 2) {
    return res.status(400).json({ error: "Please tell us your name." });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }
  if (cleanMessage.length < 5) {
    return res.status(400).json({ error: "Your message looks too short." });
  }

  db.prepare(
    "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
  ).run(cleanName, cleanEmail, cleanSubject, cleanMessage.slice(0, 5000));

  res.status(201).json({ data: { received: true } });
});

/* GET /api/contact — admin: inbox */
router.get("/contact", requireAdmin, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM contact_messages ORDER BY id DESC")
    .all();
  res.json({
    data: rows.map(({ is_read, created_at, ...row }) => ({
      ...row,
      isRead: !!is_read,
      createdAt: created_at,
    })),
  });
});

/* PATCH /api/contact/:id — admin: mark read */
router.patch("/contact/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id) || 0;
  const row = db.prepare("SELECT id FROM contact_messages WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Message not found." });
  db.prepare("UPDATE contact_messages SET is_read = 1 WHERE id = ?").run(id);
  res.json({ data: { read: true, id } });
});

/* DELETE /api/contact/:id — admin: remove message */
router.delete("/contact/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id) || 0;
  const row = db.prepare("SELECT id FROM contact_messages WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Message not found." });
  db.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
  res.json({ data: { deleted: true, id } });
});

export default router;
