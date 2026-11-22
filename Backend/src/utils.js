export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const round2 = (value) => Math.round(value * 100) / 100;

/**
 * Express 4 does not forward rejected promises to the error handler.
 * Wrap every async route/middleware so failures become proper 500 JSON
 * responses instead of unhandled rejections.
 */
export const wrap = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
