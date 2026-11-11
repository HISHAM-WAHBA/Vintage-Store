import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { db } from "./db.js";

export const hashPassword = (password) => bcrypt.hashSync(password, 10);

export const verifyPassword = (password, hash) => {
  if (!hash) return false;
  return bcrypt.compareSync(password, hash);
};

export const signToken = (user) =>
  jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

/** Maps a `users` row to the public shape returned by the API. */
export const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  phone: row.phone || "",
  address: row.address || "",
  provider: row.provider || "local",
  avatar: row.avatar || "",
  createdAt: row.created_at,
});

/** Returns the signed-in user for a request, or null (no throw on bad token). */
export const userFromRequest = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret);
    const row = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(Number(payload.sub));
    return row ? publicUser(row) : null;
  } catch {
    return null;
  }
};

export const requireAuth = (req, res, next) => {
  const user = userFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: "Please sign in to continue." });
  }
  req.user = user;
  next();
};

export const requireAdmin = (req, res, next) => {
  const user = userFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: "Please sign in to continue." });
  }
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  req.user = user;
  next();
};
