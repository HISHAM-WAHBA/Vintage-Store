import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || "vintage-dev-secret-change-me",
  jwtExpiresIn: "7d",
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  admin: {
    name: process.env.ADMIN_NAME || "Store Admin",
    email: (process.env.ADMIN_EMAIL || "admin@vintage.test").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Admin@1234",
  },
  /** Flat shipping fee, kept in sync with the checkout UI. */
  shippingFee: 12,
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackUrl:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:4000/api/auth/google/callback",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      callbackUrl:
        process.env.FACEBOOK_CALLBACK_URL ||
        "http://localhost:4000/api/auth/facebook/callback",
    },
  },
};
