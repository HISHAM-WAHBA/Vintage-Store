/**
 * REST client for the Vintage Node.js backend.
 *
 * In development, requests go to `/api/*` on the Vite dev server, which
 * proxies them to the backend (see vite.config.js) — same origin, no CORS.
 * Set VITE_API_BASE (e.g. "https://api.example.com/api") for production.
 */

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const TOKEN_KEY = "vintage_token";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

const request = async (path, { method = "GET", body } = {}) => {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  let result = {};
  try {
    result = await response.json();
  } catch {
    // Non-JSON response body — fall through to the status check.
  }

  if (!response.ok) {
    if (response.status === 401 && getStoredToken()) {
      clearStoredToken();
      localStorage.removeItem("vintage_profile");
      window.dispatchEvent(new Event("vintage-auth-changed"));
    }
    const error = new Error(result.error || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return result;
};

export const api = {
  /* ── Catalog ──────────────────────────────────────────────────────────── */
  getProducts: async () => (await request("/products")).data,
  getProductById: async (id) => (await request(`/products/${id}`)).data,
  getCategories: async () => (await request("/categories")).data,

  /* ── Auth ──────────────────────────────────────────────────────────────── */
  login: async (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  register: async (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),
  getProfile: async () => (await request("/auth/me")).data,
  updateProfile: async (details) =>
    (await request("/auth/me", { method: "PUT", body: details })).data,
  getAuthProviders: async () => (await request("/auth/providers")).data,

  /* ── Wishlist (authenticated) ─────────────────────────────────────────── */
  getWishlist: async () => (await request("/wishlist")).data,
  syncWishlist: async (productIds) =>
    (await request("/wishlist", { method: "POST", body: { productIds } })).data,
  toggleWishlist: async (productId) =>
    (await request("/wishlist/toggle", { method: "POST", body: { productId } })).data,
  removeWishlistItem: async (productId) =>
    (await request(`/wishlist/${productId}`, { method: "DELETE" })).data,

  /* ── Orders ────────────────────────────────────────────────────────────── */
  createOrder: async (payload) =>
    (await request("/orders", { method: "POST", body: payload })).data,
  getMyOrders: async () => (await request("/orders")).data,

  /* ── Newsletter & contact ─────────────────────────────────────────────── */
  subscribeNewsletter: async (email) =>
    request("/newsletter", { method: "POST", body: { email } }),
  sendMessage: async (payload) =>
    request("/contact", { method: "POST", body: payload }),

  /* ── Admin: catalog management ──────────────────────────────────────────── */
  saveProduct: async (product) =>
    product.id
      ? (await request(`/products/${product.id}`, { method: "PUT", body: product }))
          .data
      : (await request("/products", { method: "POST", body: product })).data,
  deleteProduct: async (id) =>
    request(`/products/${id}`, { method: "DELETE" }),
  saveCategory: async (name) =>
    (await request("/categories", { method: "POST", body: { name } })).data,
  deleteCategory: async (id) =>
    request(`/categories/${id}`, { method: "DELETE" }),
  updateOrderStatus: async (id, status) =>
    (await request(`/orders/${id}`, { method: "PATCH", body: { status } })).data,
};
