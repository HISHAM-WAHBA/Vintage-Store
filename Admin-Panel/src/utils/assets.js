/**
 * Resolves media URLs returned by the API.
 *
 * Uploaded images are either absolute CDN URLs (Cloudinary) or API-relative
 * paths (`/api/images/...`). The admin panel is deployed separately from the
 * API, so relative paths need the API origin prefixed.
 */

const rawBase = import.meta.env.VITE_API_BASE || "/api";

/** e.g. "https://vintage-api.vercel.app/api" */
export const API_BASE = String(rawBase).replace(/\/+$/, "");

/** e.g. "https://vintage-api.vercel.app" (empty string when using a proxy) */
export const API_ORIGIN = API_BASE.replace(/\/api$/, "");

export const assetUrl = (value) => {
  if (!value) return "";
  const url = String(value);
  if (/^(https?:|data:|blob:)/i.test(url) || url.startsWith("//")) return url;
  if (!API_ORIGIN) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};
