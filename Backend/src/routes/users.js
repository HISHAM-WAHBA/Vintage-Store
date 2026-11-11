import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

const router = Router();

/* GET /api/users — admin: customer list with order stats */
router.get("/", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.created_at,
              (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count,
              (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.user_id = u.id) AS total_spent
       FROM users u
       ORDER BY u.created_at DESC`,
    )
    .all();
  res.json({
    data: rows.map(({ created_at, order_count, total_spent, ...row }) => ({
      ...row,
      createdAt: created_at,
      orderCount: order_count,
      totalSpent: Math.round(total_spent * 100) / 100,
    })),
  });
});

export default router;
