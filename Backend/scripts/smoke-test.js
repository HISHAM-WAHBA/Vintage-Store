/**
 * End-to-end API smoke test.
 *
 * Runs the same checks against localhost, Turso or the deployed Vercel API:
 *   node scripts/smoke-test.js                              (localhost:4000)
 *   node scripts/smoke-test.js https://<api>.vercel.app/api
 *   API_BASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/smoke-test.js
 *
 * Add --with-upload to also exercise the image upload endpoint.
 *
 * Everything the test creates (product, category, user, order, contact
 * message) is deleted again before it finishes.
 */
import "dotenv/config";

const args = process.argv.slice(2);
const withUpload = args.includes("--with-upload");
const baseFromArgs = args.find((arg) => arg.startsWith("http"));
const BASE = (
  baseFromArgs ||
  process.env.API_BASE_URL ||
  "http://localhost:4000/api"
).replace(/\/+$/, "");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@vintage.test";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234";

const suffix = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const results = [];

const request = async (path, { method = "GET", body, token, form } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: payload,
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: response.status, json, headers: response.headers };
};

const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const refs = {};

const cleanup = async () => {
  const admin = refs.adminToken;
  if (!admin) return;
  const attempt = async (label, fn) => {
    try {
      await fn();
    } catch (error) {
      console.log(`cleanup skipped (${label}): ${error.message}`);
    }
  };
  if (refs.orderCode) {
    await attempt("order", () => request(`/orders/${refs.orderCode}`, { method: "DELETE", token: admin }));
  }
  if (refs.contactId) {
    await attempt("contact", () => request(`/contact/${refs.contactId}`, { method: "DELETE", token: admin }));
  }
  if (refs.productId) {
    await attempt("product", () => request(`/products/${refs.productId}`, { method: "DELETE", token: admin }));
  }
  if (refs.categoryId) {
    await attempt("category", () => request(`/categories/${refs.categoryId}`, { method: "DELETE", token: admin }));
  }
  if (refs.userId) {
    await attempt("user", () => request(`/users/${refs.userId}`, { method: "DELETE", token: admin }));
  }
};

const run = async () => {
  console.log(`\nVintage API smoke test → ${BASE}\n`);

  /* ── Public catalog ─────────────────────────────────────────────────── */
  const health = await request("/health");
  check("GET /health", health.status === 200 && health.json?.status === "ok", `HTTP ${health.status}`);

  const products = await request("/products");
  const productList = products.json?.data || [];
  check(
    "GET /products",
    products.status === 200 && Array.isArray(productList) && productList.length > 0,
    `${productList.length} products`,
  );

  const categories = await request("/categories");
  const categoryList = categories.json?.data || [];
  check(
    "GET /categories",
    categories.status === 200 &&
      categoryList.length > 0 &&
      typeof categoryList[0].productCount === "number",
    `${categoryList.length} categories`,
  );

  const firstProduct = productList[0];
  const byId = await request(`/products/${firstProduct.id}`);
  check("GET /products/:id", byId.status === 200 && byId.json?.data?.id === firstProduct.id);

  /* ── Access control ─────────────────────────────────────────────────── */
  const usersNoAuth = await request("/users");
  check("GET /users without token → 401", usersNoAuth.status === 401, `HTTP ${usersNoAuth.status}`);

  const ordersNoAuth = await request("/orders");
  check("GET /orders without token → 401", ordersNoAuth.status === 401, `HTTP ${ordersNoAuth.status}`);

  /* ── Admin session ──────────────────────────────────────────────────── */
  const adminLogin = await request("/auth/login", {
    method: "POST",
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  refs.adminToken = adminLogin.json?.token;
  check(
    "POST /auth/login (admin)",
    adminLogin.status === 200 && adminLogin.json?.user?.role === "admin",
    `HTTP ${adminLogin.status}`,
  );
  if (!refs.adminToken) throw new Error("Cannot continue without an admin token.");

  const adminUsers = await request("/users", { token: refs.adminToken });
  check(
    "GET /users (admin)",
    adminUsers.status === 200 && Array.isArray(adminUsers.json?.data),
    `${adminUsers.json?.data?.length ?? 0} users`,
  );

  /* ── Categories CRUD ────────────────────────────────────────────────── */
  const createdCategory = await request("/categories", {
    method: "POST",
    token: refs.adminToken,
    body: { name: `QA Category ${suffix}`, description: "temporary" },
  });
  refs.categoryId = createdCategory.json?.data?.id;
  check("POST /categories (admin)", createdCategory.status === 201 && !!refs.categoryId);

  /* ── Products CRUD ──────────────────────────────────────────────────── */
  const createdProduct = await request("/products", {
    method: "POST",
    token: refs.adminToken,
    body: {
      name: `QA Product ${suffix}`,
      description: "temporary product created by the smoke test",
      price: 99.5,
      quantity: 5,
      image: "/api/images/products/furniture-sofa.jpg",
      featured: true,
      category: refs.categoryId,
    },
  });
  refs.productId = createdProduct.json?.data?.id;
  check(
    "POST /products (admin)",
    createdProduct.status === 201 &&
      createdProduct.json?.data?.featured === true &&
      createdProduct.json?.data?.category?.id === refs.categoryId,
  );

  if (refs.productId) {
    const slug = createdProduct.json.data.slug;
    const bySlug = await request(`/products/${slug}`);
    check("GET /products/:slug", bySlug.status === 200 && bySlug.json?.data?.id === refs.productId);

    const updated = await request(`/products/${refs.productId}`, {
      method: "PUT",
      token: refs.adminToken,
      body: { price: 120, quantity: 7, isNew: true },
    });
    check(
      "PUT /products/:id (admin)",
      updated.status === 200 &&
        Number(updated.json?.data?.price) === 120 &&
        Number(updated.json?.data?.quantity) === 7 &&
        updated.json?.data?.isNew === true,
    );
  }

  /* ── Customer account ───────────────────────────────────────────────── */
  const email = `qa.${suffix}@example.com`;
  const password = "Test1234";
  const registered = await request("/auth/register", {
    method: "POST",
    body: { name: "QA Customer", email, password },
  });
  refs.userId = registered.json?.user?.id;
  let customerToken = registered.json?.token;
  check("POST /auth/register", registered.status === 201 && !!refs.userId, `HTTP ${registered.status}`);

  const me = await request("/auth/me", { token: customerToken });
  check("GET /auth/me", me.status === 200 && me.json?.data?.email === email);

  const profile = await request("/auth/me", {
    method: "PUT",
    token: customerToken,
    body: { name: "QA Customer Updated", phone: "01000000000" },
  });
  check(
    "PUT /auth/me",
    profile.status === 200 && profile.json?.data?.name === "QA Customer Updated",
  );

  const relogin = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  check("POST /auth/login (customer)", relogin.status === 200 && relogin.json?.user?.role === "customer");
  customerToken = relogin.json?.token;

  const badLogin = await request("/auth/login", {
    method: "POST",
    body: { email, password: "wrong-password" },
  });
  check("POST /auth/login (wrong password) → 401", badLogin.status === 401);

  /* ── Wishlist ───────────────────────────────────────────────────────── */
  if (refs.productId) {
    const added = await request("/wishlist/toggle", {
      method: "POST",
      token: customerToken,
      body: { productId: refs.productId },
    });
    check(
      "POST /wishlist/toggle (add)",
      added.status === 200 && added.json?.data?.added === true && added.json?.data?.wishlist?.length === 1,
    );

    const removed = await request("/wishlist/toggle", {
      method: "POST",
      token: customerToken,
      body: { productId: refs.productId },
    });
    check(
      "POST /wishlist/toggle (remove)",
      removed.status === 200 && removed.json?.data?.added === false && removed.json?.data?.wishlist?.length === 0,
    );

    const synced = await request("/wishlist", {
      method: "POST",
      token: customerToken,
      body: { productIds: [refs.productId] },
    });
    check("POST /wishlist (sync)", synced.status === 200 && synced.json?.data?.length === 1);

    const cleared = await request(`/wishlist/${refs.productId}`, {
      method: "DELETE",
      token: customerToken,
    });
    check("DELETE /wishlist/:productId", cleared.status === 200 && cleared.json?.data?.length === 0);
  }

  /* ── Orders ─────────────────────────────────────────────────────────── */
  if (refs.productId) {
    const order = await request("/orders", {
      method: "POST",
      body: {
        customer: {
          email,
          phone: "01000000000",
          firstName: "QA",
          lastName: "Customer",
          address: "1 Test Street",
          city: "Cairo",
          zip: "11511",
          notes: "smoke test",
        },
        paymentMethod: "cash",
        items: [{ id: refs.productId, quantity: 2 }],
        discountCode: "VINTAGE10",
      },
    });
    refs.orderCode = order.json?.data?.id;
    const data = order.json?.data;
    check(
      "POST /orders (guest, server-side totals)",
      order.status === 201 &&
        /^VT-\d{6}$/.test(String(data?.id)) &&
        Number(data?.subtotal) === 240 &&
        Math.abs(Number(data?.discountAmount) - 24) < 0.01 &&
        Number(data?.shipping) === 12 &&
        Math.abs(Number(data?.total) - 228) < 0.01 &&
        data?.items?.length === 1,
      `${data?.id} total ${data?.total}`,
    );

    const afterOrder = await request(`/products/${refs.productId}`);
    check(
      "Stock decremented after order",
      Number(afterOrder.json?.data?.quantity) === 5,
      `quantity ${afterOrder.json?.data?.quantity}`,
    );

    const adminOrders = await request("/orders", { token: refs.adminToken });
    check(
      "GET /orders (admin)",
      adminOrders.status === 200 &&
        (adminOrders.json?.data || []).some((row) => row.id === refs.orderCode),
    );

    const shipped = await request(`/orders/${refs.orderCode}`, {
      method: "PATCH",
      token: refs.adminToken,
      body: { status: "Shipped" },
    });
    check("PATCH /orders/:id (admin)", shipped.status === 200 && shipped.json?.data?.status === "Shipped");

    const deletedOrder = await request(`/orders/${refs.orderCode}`, {
      method: "DELETE",
      token: refs.adminToken,
    });
    check("DELETE /orders/:id (admin)", deletedOrder.status === 200);
    refs.orderCode = null;

    // Put the stock back so the catalog is unchanged.
    await request(`/products/${refs.productId}`, {
      method: "PUT",
      token: refs.adminToken,
      body: { quantity: 7 },
    });
  }

  /* ── Contact & newsletter ───────────────────────────────────────────── */
  const contact = await request("/contact", {
    method: "POST",
    body: { name: "QA", email, subject: "Smoke test", message: "Please ignore this message." },
  });
  const contactList = await request("/contact", { token: refs.adminToken });
  refs.contactId = (contactList.json?.data || []).find((row) => row.email === email)?.id;
  check(
    "POST /contact + admin inbox",
    contact.status === 201 && !!refs.contactId,
  );

  if (refs.contactId) {
    const marked = await request(`/contact/${refs.contactId}`, {
      method: "PATCH",
      token: refs.adminToken,
    });
    const removedContact = await request(`/contact/${refs.contactId}`, {
      method: "DELETE",
      token: refs.adminToken,
    });
    check(
      "PATCH + DELETE /contact/:id",
      marked.status === 200 && removedContact.status === 200,
    );
    refs.contactId = null;
  }

  const badNewsletter = await request("/newsletter", {
    method: "POST",
    body: { email: "not-an-email" },
  });
  check("POST /newsletter (invalid) → 400", badNewsletter.status === 400);

  /* ── Uploads (optional) ─────────────────────────────────────────────── */
  if (withUpload) {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const form = new FormData();
    form.append("image", new Blob([png], { type: "image/png" }), "smoke.png");
    const uploaded = await request("/uploads?folder=products", {
      method: "POST",
      token: refs.adminToken,
      form,
    });
    const url = uploaded.json?.data?.url;
    check("POST /uploads (admin)", uploaded.status === 201 && !!url, url || `HTTP ${uploaded.status}`);

    if (url && /^https?:/.test(url)) {
      const remote = await fetch(url, { method: "GET" });
      check("Uploaded image is reachable", remote.ok, `HTTP ${remote.status}`);
    }
  }

  /* ── CORS preflight ─────────────────────────────────────────────────── */
  const preflight = await fetch(`${BASE}/products`, {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:5173",
      "Access-Control-Request-Method": "GET",
    },
  });
  check(
    "CORS preflight (allow-origin)",
    preflight.status >= 200 && preflight.status < 300,
    `HTTP ${preflight.status}`,
  );

  /* ── Cleanup ────────────────────────────────────────────────────────── */
  console.log("\nCleaning up test data…");
  await cleanup();

  if (refs.productId) {
    const gone = await request(`/products/${refs.productId}`);
    check("DELETE /products/:id (admin)", gone.status === 404);
    refs.productId = null;
  }
  if (refs.categoryId) {
    const gone = await request("/categories");
    check(
      "DELETE /categories/:id (admin)",
      !(gone.json?.data || []).some((row) => row.id === refs.categoryId),
    );
    refs.categoryId = null;
  }
};

try {
  await run();
} catch (error) {
  check("Unexpected error", false, error.message);
  await cleanup();
}

const failed = results.filter((result) => !result.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed.`,
);
if (failed.length > 0) {
  console.log("\nFailed checks:");
  for (const result of failed) console.log(`  - ${result.name}${result.detail ? ` (${result.detail})` : ""}`);
  process.exit(1);
}
