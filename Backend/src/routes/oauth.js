import { Router } from "express";
import crypto from "node:crypto";
import { db } from "../db.js";
import { config } from "../config.js";
import { publicUser, signToken } from "../auth.js";

const router = Router();

/* GET /api/auth/providers — public: which social providers are configured */
router.get("/providers", (_req, res) => {
  res.json({
    data: {
      google: !!(config.oauth.google.clientId && config.oauth.google.clientSecret),
      facebook: !!(config.oauth.facebook.clientId && config.oauth.facebook.clientSecret),
    },
  });
});

/**
 * Minimal OAuth2 (authorization code) flow for Google and Facebook.
 * Requires provider credentials in .env (see .env.example). Without them the
 * start endpoints redirect back to the storefront with an explanatory error.
 */

const encodeState = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString("base64url");
const decodeState = (s) => {
  try {
    return JSON.parse(Buffer.from(s, "base64url").toString("utf8"));
  } catch {
    return {};
  }
};

const redirectWithError = (res, message, next = "/dashboard") => {
  const url = new URL("/auth", config.frontendUrl);
  url.searchParams.set("error", message);
  if (next) url.searchParams.set("next", next);
  res.redirect(url.toString());
};

const redirectWithToken = (res, user, next = "/dashboard") => {
  const token = signToken(user);
  const url = new URL("/auth/callback", config.frontendUrl);
  url.searchParams.set("token", token);
  url.searchParams.set("next", next);
  res.redirect(url.toString());
};

const findOrCreateOAuthUser = ({ provider, providerId, email, name, avatar }) => {
  // 1) existing link by provider+id
  let row = db
    .prepare("SELECT * FROM users WHERE provider = ? AND provider_id = ?")
    .get(provider, providerId);
  if (row) return publicUser(row);

  // 2) existing account by email -> link it
  if (email) {
    row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
    if (row) {
      db.prepare(
        "UPDATE users SET provider = ?, provider_id = ?, avatar = CASE WHEN avatar = '' THEN ? ELSE avatar END WHERE id = ?",
      ).run(provider, providerId, avatar || "", row.id);
      row = db.prepare("SELECT * FROM users WHERE id = ?").get(row.id);
      return publicUser(row);
    }
  }

  // 3) create new customer
  const safeEmail =
    (email && email.toLowerCase()) ||
    `${provider}-${providerId}@${provider}.local`;
  const result = db
    .prepare(
      "INSERT INTO users (name, email, password_hash, role, provider, provider_id, avatar) VALUES (?, ?, NULL, 'customer', ?, ?, ?)",
    )
    .run(name || "Customer", safeEmail, provider, providerId, avatar || "");
  row = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(result.lastInsertRowid));
  return publicUser(row);
};

/* ── Google ───────────────────────────────────────────────────────────────── */

router.get("/google", (req, res) => {
  const { clientId, callbackUrl } = config.oauth.google;
  const next = String(req.query.next || "/dashboard");
  if (!clientId) {
    return redirectWithError(
      res,
      "Google sign-in is not configured yet. Please sign in with email.",
      next,
    );
  }
  const state = encodeState({ next, nonce: crypto.randomBytes(8).toString("hex") });
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/google/callback", async (req, res) => {
  const { clientId, clientSecret, callbackUrl } = config.oauth.google;
  const { code, state, error } = req.query;
  const { next = "/dashboard" } = decodeState(String(state || ""));
  if (error) return redirectWithError(res, "Google sign-in was cancelled.", next);
  if (!code || !clientId || !clientSecret) {
    return redirectWithError(res, "Google sign-in failed. Please try again.", next);
  }
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "Token exchange failed");
    }
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    if (!profileRes.ok || !profile.id) throw new Error("Profile fetch failed");

    const user = findOrCreateOAuthUser({
      provider: "google",
      providerId: String(profile.id),
      email: profile.email,
      name: profile.name || profile.email || "Customer",
      avatar: profile.picture || "",
    });
    return redirectWithToken(res, user, next);
  } catch (e) {
    console.error("[oauth/google]", e.message);
    return redirectWithError(res, "Google sign-in failed. Please try again.", next);
  }
});

/* ── Facebook ─────────────────────────────────────────────────────────────── */

router.get("/facebook", (req, res) => {
  const { clientId, callbackUrl } = config.oauth.facebook;
  const next = String(req.query.next || "/dashboard");
  if (!clientId) {
    return redirectWithError(
      res,
      "Facebook sign-in is not configured yet. Please sign in with email.",
      next,
    );
  }
  const state = encodeState({ next, nonce: crypto.randomBytes(8).toString("hex") });
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "email,public_profile",
    state,
  });
  res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params}`);
});

router.get("/facebook/callback", async (req, res) => {
  const { clientId, clientSecret, callbackUrl } = config.oauth.facebook;
  const { code, state, error } = req.query;
  const { next = "/dashboard" } = decodeState(String(state || ""));
  if (error) return redirectWithError(res, "Facebook sign-in was cancelled.", next);
  if (!code || !clientId || !clientSecret) {
    return redirectWithError(res, "Facebook sign-in failed. Please try again.", next);
  }
  try {
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      code: String(code),
    });
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${tokenParams}`,
    );
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error?.message || "Token exchange failed");
    }
    const profileRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(tokenData.access_token)}`,
    );
    const profile = await profileRes.json();
    if (!profileRes.ok || !profile.id) throw new Error("Profile fetch failed");

    const user = findOrCreateOAuthUser({
      provider: "facebook",
      providerId: String(profile.id),
      email: profile.email,
      name: profile.name || profile.email || "Customer",
      avatar: profile.picture?.data?.url || "",
    });
    return redirectWithToken(res, user, next);
  } catch (e) {
    console.error("[oauth/facebook]", e.message);
    return redirectWithError(res, "Facebook sign-in failed. Please try again.", next);
  }
});

export default router;
