import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Mail,
  Newspaper,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "subscribers", label: "Subscribers", icon: Newspaper },
];

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const [p, c, o, u, m, s] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getUsers(),
        api.getMessages(),
        api.getSubscribers(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setCustomers(u);
      setMessages(m);
      setSubscribers(s);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const stats = {
    products: products.length,
    categories: categories.length,
    orders: orders.length,
    customers: customers.length,
    revenue: orders.reduce((t, o) => t + Number(o.total || 0), 0),
    unread: messages.filter((m) => !m.isRead).length,
    subscribers: subscribers.length,
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-outline-variant/30 bg-surface-container-lowest transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-outline-variant/30 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="font-serif text-lg leading-none text-on-surface">
              Vintage
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-label-md text-label-md transition-colors ${
                  active
                    ? "bg-primary-fixed text-on-primary-fixed-variant"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.id === "messages" && stats.unread > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-on-primary">
                    {stats.unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-outline-variant/30 p-4">
          <div className="mb-3 px-3">
            <p className="font-label-md text-label-md text-on-surface">
              {user?.name || user?.email}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-inverse-surface/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/80 px-4 backdrop-blur md:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-on-surface-variant md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {NAV.find((n) => n.id === section)?.label}
          </h2>
          <button
            type="button"
            onClick={reload}
            className="rounded-full border border-outline-variant px-4 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            Refresh
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-on-surface-variant">
              Loading data…
            </div>
          ) : (
            <>
              {section === "overview" && <Overview stats={stats} orders={orders} />}
              {section === "products" && (
                <ProductsSection
                  products={products}
                  categories={categories}
                  reload={reload}
                />
              )}
              {section === "categories" && (
                <CategoriesSection
                  categories={categories}
                  reload={reload}
                />
              )}
              {section === "orders" && (
                <OrdersSection orders={orders} reload={reload} />
              )}
              {section === "customers" && <CustomersSection customers={customers} />}
              {section === "messages" && (
                <MessagesSection messages={messages} reload={reload} />
              )}
              {section === "subscribers" && (
                <SubscribersSection subscribers={subscribers} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

/* ─── Overview ─────────────────────────────────────────────────────────────── */

const Overview = ({ stats, orders }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[
        { label: "Products", value: stats.products, icon: Package },
        { label: "Categories", value: stats.categories, icon: FolderTree },
        { label: "Orders", value: stats.orders, icon: ShoppingBag },
        { label: "Customers", value: stats.customers, icon: Users },
        { label: "Subscribers", value: stats.subscribers, icon: Newspaper },
        { label: "Unread messages", value: stats.unread, icon: Mail },
        { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: LayoutDashboard },
      ].map(({ label, value, icon: I }) => (
        <div
          key={label}
          className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
        >
          <I className="h-5 w-5 text-primary" />
          <p className="mt-4 font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
            {label}
          </p>
          <p className="mt-1 font-headline-md text-headline-md text-on-surface">
            {value}
          </p>
        </div>
      ))}
    </div>

    <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
      <h3 className="mb-4 font-headline-md text-headline-md text-on-surface">
        Recent orders
      </h3>
      {orders.length === 0 ? (
        <p className="py-8 text-center text-on-surface-variant">
          No orders yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md text-body-md">
            <thead className="border-b border-outline-variant/40 text-on-surface-variant">
              <tr>
                <th className="py-3 pr-4 font-label-md text-label-md">Order</th>
                <th className="py-3 pr-4 font-label-md text-label-md">Customer</th>
                <th className="py-3 pr-4 font-label-md text-label-md">Total</th>
                <th className="py-3 pr-4 font-label-md text-label-md">Status</th>
                <th className="py-3 font-label-md text-label-md">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id}>
                  <td className="py-3 pr-4 font-label-md text-primary">{o.id}</td>
                  <td className="py-3 pr-4">{o.user?.name || o.customer?.name || "Guest"}</td>
                  <td className="py-3 pr-4">${Number(o.total).toFixed(2)}</td>
                  <td className="py-3 pr-4 capitalize">{o.status}</td>
                  <td className="py-3 text-on-surface-variant">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </div>
);

/* ─── Products ─────────────────────────────────────────────────────────────── */

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  image: "",
  featured: false,
  isNew: false,
  category: "",
};

const ProductsSection = ({ products, categories, reload }) => {
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const openNew = () => {
    setForm(emptyProduct);
    setEditing("new");
  };
  const openEdit = (p) => {
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      quantity: p.quantity ?? "",
      image: p.image || "",
      featured: !!p.featured,
      isNew: !!p.isNew,
      category: p.categories?.[0] || "",
    });
    setEditing(p);
  };
  const close = () => setEditing(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        image: form.image.trim(),
        featured: form.featured,
        isNew: form.isNew,
        category: form.category || undefined,
      };
      if (editing === "new") {
        await api.createProduct(payload);
        toast.success("Product created");
      } else {
        await api.updateProduct(editing.id, payload);
        toast.success("Product updated");
      }
      await reload();
      close();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.deleteProduct(p.id);
      toast.success("Product deleted");
      await reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="border-b border-outline-variant/40 text-on-surface-variant">
            <tr>
              <th className="py-3 pl-4 pr-3 font-label-md text-label-md">Product</th>
              <th className="py-3 pr-3 font-label-md text-label-md">Category</th>
              <th className="py-3 pr-3 font-label-md text-label-md">Price</th>
              <th className="py-3 pr-3 font-label-md text-label-md">Stock</th>
              <th className="py-3 pr-3 font-label-md text-label-md">Flags</th>
              <th className="py-3 pr-4 font-label-md text-label-md">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="py-3 pl-4 pr-3">
                  <div className="flex items-center gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <span className="font-label-md text-on-surface">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-3 text-on-surface-variant">
                  {p.categories?.[0] || "—"}
                </td>
                <td className="py-3 pr-3">${Number(p.price).toFixed(2)}</td>
                <td className="py-3 pr-3">{p.quantity}</td>
                <td className="py-3 pr-3">
                  <div className="flex gap-1">
                    {p.featured && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        Featured
                      </span>
                    )}
                    {p.isNew && (
                      <span className="rounded-full bg-tertiary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-tertiary">
                        New
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductModal
          form={form}
          setForm={setForm}
          categories={categories}
          saving={saving}
          onSave={handleSave}
          onClose={close}
          isNew={editing === "new"}
        />
      )}
    </div>
  );
};

const ProductModal = ({ form, setForm, categories, saving, onSave, onClose, isNew }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          {isNew ? "New product" : "Edit product"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field
            label="Category"
            type="select"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={categories.map((c) => ({ value: c.name, label: c.name }))}
          />
          <Field label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
          <Field label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} required />
        </div>
        <Field label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
        <Field
          label="Description"
          type="textarea"
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 font-body-md text-body-md">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 font-body-md text-body-md">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            New arrival
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-outline-variant px-5 py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Check className="h-4 w-4" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text", required, options }) => (
  <label className="block">
    <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    ) : type === "select" ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">— None —</option>
        {options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    )}
  </label>
);

/* ─── Categories ───────────────────────────────────────────────────────────── */

const CategoriesSection = ({ categories, reload }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await api.createCategory({ name: name.trim(), description: description.trim() });
      toast.success("Category created");
      setName("");
      setDescription("");
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.name}"? Products will be reassigned.`)) return;
    try {
      await api.deleteCategory(c.id);
      toast.success("Category deleted");
      await reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
      >
        <h3 className="mb-4 font-headline-md text-headline-md text-on-surface">
          New category
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={name} onChange={setName} required />
          <Field label="Description" value={description} onChange={setDescription} />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="border-b border-outline-variant/40 text-on-surface-variant">
            <tr>
              <th className="py-3 pl-4 pr-3 font-label-md text-label-md">Name</th>
              <th className="py-3 pr-3 font-label-md text-label-md">Slug</th>
              <th className="py-3 pr-3 font-label-md text-label-md">Products</th>
              <th className="py-3 pr-4 font-label-md text-label-md">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="py-3 pl-4 pr-3 font-label-md text-on-surface">{c.name}</td>
                <td className="py-3 pr-3 text-on-surface-variant">{c.slug}</td>
                <td className="py-3 pr-3">{c.productCount}</td>
                <td className="py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Orders ───────────────────────────────────────────────────────────────── */

const OrdersSection = ({ orders, reload }) => {
  const handleStatus = async (o, status) => {
    try {
      await api.updateOrderStatus(o.id, status);
      toast.success("Status updated");
      await reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
      <table className="w-full text-left font-body-md text-body-md">
        <thead className="border-b border-outline-variant/40 text-on-surface-variant">
          <tr>
            <th className="py-3 pl-4 pr-3 font-label-md text-label-md">Order</th>
            <th className="py-3 pr-3 font-label-md text-label-md">Customer</th>
            <th className="py-3 pr-3 font-label-md text-label-md">Items</th>
            <th className="py-3 pr-3 font-label-md text-label-md">Total</th>
            <th className="py-3 pr-3 font-label-md text-label-md">Status</th>
            <th className="py-3 pr-4 font-label-md text-label-md">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="py-3 pl-4 pr-3 font-label-md text-primary">{o.id}</td>
              <td className="py-3 pr-3">
                {o.user?.name || o.customer?.name || "Guest"}
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                  {o.user?.email || o.customer?.email}
                </div>
              </td>
              <td className="py-3 pr-3">{o.items?.length || 0}</td>
              <td className="py-3 pr-3">${Number(o.total).toFixed(2)}</td>
              <td className="py-3 pr-3">
                <select
                  value={o.status}
                  onChange={(e) => handleStatus(o, e.target.value)}
                  className="rounded-lg border border-outline-variant bg-surface px-2 py-1 font-body-md text-body-md capitalize outline-none focus:border-primary"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 pr-4 text-on-surface-variant">
                {new Date(o.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="py-12 text-center text-on-surface-variant">No orders yet.</p>
      )}
    </div>
  );
};

/* ─── Customers ────────────────────────────────────────────────────────────── */

const CustomersSection = ({ customers }) => (
  <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
    <table className="w-full text-left font-body-md text-body-md">
      <thead className="border-b border-outline-variant/40 text-on-surface-variant">
        <tr>
          <th className="py-3 pl-4 pr-3 font-label-md text-label-md">Name</th>
          <th className="py-3 pr-3 font-label-md text-label-md">Email</th>
          <th className="py-3 pr-3 font-label-md text-label-md">Phone</th>
          <th className="py-3 pr-3 font-label-md text-label-md">Orders</th>
          <th className="py-3 pr-4 font-label-md text-label-md">Spent</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/20">
        {customers.map((u) => (
          <tr key={u.id}>
            <td className="py-3 pl-4 pr-3 font-label-md text-on-surface">{u.name}</td>
            <td className="py-3 pr-3 text-on-surface-variant">{u.email}</td>
            <td className="py-3 pr-3">{u.phone || "—"}</td>
            <td className="py-3 pr-3">{u.orderCount}</td>
            <td className="py-3 pr-4">${Number(u.totalSpent).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {customers.length === 0 && (
      <p className="py-12 text-center text-on-surface-variant">No customers yet.</p>
    )}
  </div>
);

/* ─── Messages ────────────────────────────────────────────────────────────── */

const MessagesSection = ({ messages, reload }) => {
  const handleRead = async (m) => {
    if (m.isRead) return;
    try {
      await api.markMessageRead(m.id);
      await reload();
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleDelete = async (m) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.deleteMessage(m.id);
      toast.success("Message deleted");
      await reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <p className="py-12 text-center text-on-surface-variant">No messages yet.</p>
      )}
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-xl border p-5 shadow-[0_10px_30px_rgba(45,41,38,0.05)] ${
            m.isRead
              ? "border-outline-variant/20 bg-surface-container-lowest"
              : "border-primary/30 bg-primary-fixed/30"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-label-md text-label-md text-on-surface">{m.name}</p>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  &lt;{m.email}&gt;
                </span>
                {!m.isRead && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-on-primary">
                    New
                  </span>
                )}
              </div>
              {m.subject && (
                <p className="mt-1 font-label-md text-label-md text-primary">
                  {m.subject}
                </p>
              )}
              <p className="mt-2 whitespace-pre-wrap font-body-md text-body-md text-on-surface">
                {m.message}
              </p>
              <p className="mt-2 font-label-sm text-label-sm text-on-surface-variant">
                {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {!m.isRead && (
                <button
                  type="button"
                  onClick={() => handleRead(m)}
                  className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(m)}
                className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-error"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Subscribers ─────────────────────────────────────────────────────────── */

const SubscribersSection = ({ subscribers }) => (
  <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
    <table className="w-full text-left font-body-md text-body-md">
      <thead className="border-b border-outline-variant/40 text-on-surface-variant">
        <tr>
          <th className="py-3 pl-4 pr-3 font-label-md text-label-md">Email</th>
          <th className="py-3 pr-4 font-label-md text-label-md">Subscribed</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/20">
        {subscribers.map((s) => (
          <tr key={s.id}>
            <td className="py-3 pl-4 pr-3 font-label-md text-on-surface">{s.email}</td>
            <td className="py-3 pr-4 text-on-surface-variant">
              {new Date(s.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {subscribers.length === 0 && (
      <p className="py-12 text-center text-on-surface-variant">No subscribers yet.</p>
    )}
  </div>
);

export default DashboardPage;
