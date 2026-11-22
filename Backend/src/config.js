import "dotenv/config";

const isProduction =
  process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

const jwtSecretFromEnv = String(process.env.JWT_SECRET || "").trim();

if (isProduction && (!jwtSecretFromEnv || jwtSecretFromEnv === "change-me-to-a-long-random-secret")) {
  throw new Error(
    "JWT_SECRET must be set to a long random value in production (set it in the Vercel project env vars).",
  );
}

const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const frontendUrl = String(
  process.env.FRONTEND_URL || "http://localhost:5173",
).replace(/\/+$/, "");

const corsOrigins = parseOrigins(
  process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174",
);

// Never lock the storefront out if FRONTEND_URL was set but CORS_ORIGIN was not.
if (frontendUrl && !corsOrigins.includes(frontendUrl)) {
  corsOrigins.push(frontendUrl);
}

const adminEmail = String(process.env.ADMIN_EMAIL || "admin@vintage.test")
  .trim()
  .toLowerCase();
const adminPassword = String(process.env.ADMIN_PASSWORD || "Admin@1234");

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 4000,
  jwtSecret: jwtSecretFromEnv || "vintage-dev-secret-change-me",
  jwtExpiresIn: "7d",
  corsOrigins,
  frontendUrl,
  admin: {
    name: process.env.ADMIN_NAME || "Store Admin",
    email: adminEmail,
    password: adminPassword,
    /**
     * In production we only create the seeded admin when credentials were
     * provided explicitly — never with the well-known development defaults.
     */
    canSeed:
      !isProduction ||
      (Boolean(process.env.ADMIN_EMAIL) && Boolean(process.env.ADMIN_PASSWORD)),
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
  cloudinary: {
    cloudName: String(process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
    apiKey: String(process.env.CLOUDINARY_API_KEY || "").trim(),
    apiSecret: String(process.env.CLOUDINARY_API_SECRET || "").trim(),
    get enabled() {
      return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    },
  },
};
