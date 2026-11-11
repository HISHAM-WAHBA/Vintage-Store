const BASE = "/api";

const getToken = () => localStorage.getItem("vintage_admin_token");
const setToken = (t) => (t ? localStorage.setItem("vintage_admin_token", t) : localStorage.removeItem("vintage_admin_token"));

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  getProfile: () => request("/auth/me"),

  getProducts: () => request("/products").then((r) => r.data),
  createProduct: (p) => request("/products", { method: "POST", body: p }),
  updateProduct: (id, p) => request(`/products/${id}`, { method: "PUT", body: p }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  getCategories: () => request("/categories").then((r) => r.data),
  createCategory: (c) => request("/categories", { method: "POST", body: c }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  getOrders: () => request("/orders").then((r) => r.data),
  updateOrderStatus: (id, status) => request(`/orders/${id}`, { method: "PATCH", body: { status } }),

  getUsers: () => request("/users").then((r) => r.data),

  getSubscribers: () => request("/newsletter").then((r) => r.data),
  getMessages: () => request("/contact").then((r) => r.data),
  markMessageRead: (id) => request(`/contact/${id}`, { method: "PATCH" }),
  deleteMessage: (id) => request(`/contact/${id}`, { method: "DELETE" }),
};

export { getToken, setToken };
