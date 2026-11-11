import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || "vintage-dev-secret-change-me",
  jwtExpiresIn: "7d",
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  admin: {
    name: process.env.ADMIN_NAME || "Store Admin",
    email: (process.env.ADMIN_EMAIL || "admin@vintage.test").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Admin@1234",
  },
  /** Flat shipping fee, kept in sync with the checkout UI. */
  shippingFee: 12,
};
