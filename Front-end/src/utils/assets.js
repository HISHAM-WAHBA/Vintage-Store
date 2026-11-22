/**
 * Resolves media URLs returned by the API.
 *
 * Images uploaded through the dashboard are stored either as absolute CDN
 * URLs (Cloudinary) or as API-relative paths (`/api/images/...`). When the
 * storefront is deployed on a different origin than the API, those relative
 * paths must be prefixed with the API origin or they would hit the Vercel
 * static host and 404.
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
  if (!API_ORIGIN) return url; // dev proxy or same-origin deployment
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};
