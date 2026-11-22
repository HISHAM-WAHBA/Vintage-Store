import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin, hashPassword } from "../auth.js";
import { wrap } from "../utils.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  phone: row.phone || "",
  address: row.address || "",
  provider: row.provider || "local",
  avatar: row.avatar || "",
  createdAt: row.created_at,
  orderCount: row.order_count ?? 0,
  totalSpent: Math.round((row.total_spent ?? 0) * 100) / 100,
});

/* GET /api/users — admin: user list with order stats */
router.get(
  "/",
  requireAdmin,
  wrap(async (_req, res) => {
    const rows = await db.all(
      `SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.provider, u.avatar, u.created_at,
              (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count,
              (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.user_id = u.id) AS total_spent
       FROM users u
       ORDER BY u.created_at DESC`,
    );
    res.json({ data: rows.map(toUser) });
  }),
);

/* POST /api/users — admin: create user (customer or admin) */
router.post(
  "/",
  requireAdmin,
  wrap(async (req, res) => {
    const {
      name = "",
      email = "",
      password = "",
      role = "customer",
      phone = "",
      address = "",
    } = req.body || {};

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanRole = role === "admin" ? "admin" : "customer";

    if (cleanName.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters." });
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existing = await db.get("SELECT id FROM users WHERE email = ?", [
      cleanEmail,
    ]);
    if (existing) {
      return res.status(409).json({ error: "A user with this email already exists." });
    }

    const result = await db.run(
      "INSERT INTO users (name, email, password_hash, role, phone, address, provider) VALUES (?, ?, ?, ?, ?, ?, 'local')",
      [
        cleanName,
        cleanEmail,
        hashPassword(String(password)),
        cleanRole,
        String(phone).trim(),
        String(address).trim(),
      ],
    );

    const row = await db.get(
      `SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.provider, u.avatar, u.created_at,
              0 AS order_count, 0 AS total_spent
       FROM users u WHERE u.id = ?`,
      [result.lastInsertRowid],
    );

    res.status(201).json({ data: toUser(row) });
  }),
);

/* PUT /api/users/:id — admin: update user (optionally reset password) */
router.put(
  "/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid user id." });

    const row = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!row) return res.status(404).json({ error: "User not found." });

    const { name, email, role, phone, address, password } = req.body || {};

    const nextName = name != null ? String(name).trim() : row.name;
    const nextEmail = email != null ? String(email).trim().toLowerCase() : row.email;
    const nextRole = role != null ? (role === "admin" ? "admin" : "customer") : row.role;
    const nextPhone = phone != null ? String(phone).trim() : (row.phone || "");
    const nextAddress = address != null ? String(address).trim() : (row.address || "");

    if (nextName.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters." });
    }
    if (!EMAIL_RE.test(nextEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    // Prevent demoting the last admin
    if (row.role === "admin" && nextRole !== "admin") {
      const adminCount = await db.get(
        "SELECT COUNT(*) AS c FROM users WHERE role = 'admin'",
      );
      if (Number(adminCount.c) <= 1) {
        return res.status(400).json({ error: "You cannot remove the last admin account." });
      }
    }

    const emailOwner = await db.get(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [nextEmail, id],
    );
    if (emailOwner) {
      return res.status(409).json({ error: "Another user already uses this email." });
    }

    let passwordHash = row.password_hash;
    if (password != null && String(password).trim() !== "") {
      if (String(password).length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }
      passwordHash = hashPassword(String(password));
    }

    await db.run(
      "UPDATE users SET name = ?, email = ?, role = ?, phone = ?, address = ?, password_hash = ? WHERE id = ?",
      [nextName, nextEmail, nextRole, nextPhone, nextAddress, passwordHash, id],
    );

    const updated = await db.get(
      `SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.provider, u.avatar, u.created_at,
              (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count,
              (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.user_id = u.id) AS total_spent
       FROM users u WHERE u.id = ?`,
      [id],
    );

    res.json({ data: toUser(updated) });
  }),
);

/* DELETE /api/users/:id — admin: delete user */
router.delete(
  "/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid user id." });

    const row = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!row) return res.status(404).json({ error: "User not found." });

    if (req.user.id === id) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }
    if (row.role === "admin") {
      const adminCount = await db.get(
        "SELECT COUNT(*) AS c FROM users WHERE role = 'admin'",
      );
      if (Number(adminCount.c) <= 1) {
        return res.status(400).json({ error: "You cannot delete the last admin account." });
      }
    }

    await db.run("DELETE FROM users WHERE id = ?", [id]);
    res.json({ data: { deleted: true, id } });
  }),
);

export default router;
