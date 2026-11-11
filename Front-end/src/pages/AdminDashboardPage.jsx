import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  Edit3,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Settings2,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { api, getStoredToken } from "../services/api";

const emptyProduct = {
  name: "",
  price: "",
  quantity: "",
  category: "",
  image: "",
  description: "",
};

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      const [loadedProducts, loadedCategories] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(loadedProducts);
      setCategories(loadedCategories);
    };
    loadAdminData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const category = product.categories?.[0] || "";
    const matchesCategory =
      categoryFilter === "all" || category === categoryFilter;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      category.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const openNewProduct = () => {
    setEditingProductId(null);
    setProductForm({
      ...emptyProduct,
      quantity: "10",
      category: categories[0]?.name || "",
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity ?? 0),
      category: product.categories?.[0] || "",
      image: product.image,
      description: product.description || "",
    });
    setIsProductModalOpen(true);
  };

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      const saved = await api.saveProduct({
        ...(editingProductId ? { id: editingProductId } : {}),
        name: productForm.name,
        price: Number(productForm.price),
        quantity: Math.max(0, Math.trunc(Number(productForm.quantity) || 0)),
        description: productForm.description,
        image: productForm.image,
        category: productForm.category,
      });
      setProducts((current) =>
        editingProductId
          ? current.map((product) =>
              product.id === saved.id ? saved : product,
            )
          : [saved, ...current],
      );
      setIsProductModalOpen(false);
      toast.success(editingProductId ? "Product updated" : "Product added");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product || !window.confirm(`Delete ${product.name}?`)) return;
    try {
      await api.deleteProduct(productId);
      setProducts((current) => current.filter((item) => item.id !== productId));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addCategory = async (event) => {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    if (
      categories.some(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error("This category already exists");
      return;
    }
    try {
      const saved = await api.saveCategory(name);
      setCategories((current) => [...current, saved]);
      setNewCategory("");
      toast.success("Category added");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (categories.length <= 1) {
      toast.error("Keep at least one category");
      return;
    }
    const category = categories.find((item) => item.id === categoryId);
    if (!category || !window.confirm(`Delete ${category.name}?`)) return;
    try {
      await api.deleteCategory(categoryId);
      // The backend reassigns the category's products — reload both lists.
      const [loadedProducts, loadedCategories] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(loadedProducts);
      setCategories(loadedCategories);
      if (categoryFilter === category.name) setCategoryFilter("all");
      toast.success("Category deleted and products reassigned");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-vintage-brown/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-vintage-gold">
              Store control
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-none text-vintage-brown sm:text-6xl">
              Admin dashboard
            </h1>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-vintage-light-brown">
              Manage the catalog and keep every collection ready for customers.
            </p>
            {!getStoredToken() && (
              <p className="mt-2 max-w-xl font-sans text-xs leading-relaxed text-vintage-light-brown">
                Sign in with an admin account to add, edit or remove catalog
                items.
              </p>
            )}
          </div>
          <Link
            to="/"
            className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-light-brown transition-colors hover:text-vintage-gold"
          >
            View storefront
          </Link>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {[
            [LayoutDashboard, "Products", products.length],
            [Tags, "Categories", categories.length],
            [
              Package,
              "In catalog",
              products.filter((product) => product.categories?.[0]).length,
            ],
            [Settings2, "Mode", "Live API"],
          ].map(([DashboardIcon, label, value]) => (
            <div
              key={label}
              className="border border-vintage-brown/10 bg-white p-4 sm:p-6"
            >
              <DashboardIcon
                className="h-5 w-5 text-vintage-gold"
                strokeWidth={1.6}
              />
              <p className="mt-5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-vintage-light-brown">
                {label}
              </p>
              <p className="mt-2 truncate font-serif text-2xl text-vintage-brown">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-6 border-b border-vintage-brown/10">
          {[
            { id: "products", label: "Products" },
            { id: "categories", label: "Categories" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-4 font-sans text-xs font-bold uppercase tracking-[0.18em] transition-colors ${activeTab === tab.id ? "border-vintage-gold text-vintage-brown" : "border-transparent text-vintage-light-brown hover:text-vintage-brown"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <section className="mt-8 border-t-4 border-vintage-gold bg-white p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-5 border-b border-vintage-brown/10 pb-6 lg:flex-row lg:items-center">
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-gold">
                  Catalog manager
                </p>
                <h2 className="mt-2 font-serif text-3xl text-vintage-brown">
                  All products
                </h2>
              </div>
              <button
                type="button"
                onClick={openNewProduct}
                className="inline-flex items-center justify-center gap-2 bg-vintage-brown px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-vintage-cream transition-colors hover:bg-vintage-gold hover:text-vintage-brown"
              >
                <Plus className="h-4 w-4" /> Add product
              </button>
            </div>
            <div className="flex flex-col gap-3 py-6 sm:flex-row">
              <label className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vintage-light-brown" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-vintage-brown/15 bg-vintage-cream py-3 pl-10 pr-4 font-sans text-sm text-vintage-brown outline-none focus:border-vintage-gold"
                />
              </label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="border border-vintage-brown/15 bg-vintage-cream px-4 py-3 font-sans text-sm text-vintage-brown outline-none focus:border-vintage-gold"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="divide-y divide-vintage-brown/10">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-14 shrink-0 object-cover"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-xl text-vintage-brown">
                        {product.name}
                      </h3>
                      <p className="mt-1 truncate font-sans text-xs text-vintage-light-brown">
                        {product.categories?.[0] || "Uncategorized"} · $
                        {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => openEditProduct(product)}
                      aria-label={`Edit ${product.name}`}
                      className="flex h-10 w-10 items-center justify-center border border-vintage-brown/15 text-vintage-brown transition-colors hover:border-vintage-gold hover:text-vintage-gold"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      aria-label={`Delete ${product.name}`}
                      className="flex h-10 w-10 items-center justify-center border border-red-200 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="py-16 text-center font-sans text-sm text-vintage-light-brown">
                  No products match this filter.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "categories" && (
          <section className="mt-8 border-t-4 border-vintage-gold bg-white p-5 sm:p-8">
            <div className="border-b border-vintage-brown/10 pb-6">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-gold">
                Collection structure
              </p>
              <h2 className="mt-2 font-serif text-3xl text-vintage-brown">
                Categories
              </h2>
            </div>
            <form
              onSubmit={addCategory}
              className="flex flex-col gap-3 py-6 sm:flex-row"
            >
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="New category name"
                className="flex-1 border border-vintage-brown/15 bg-vintage-cream px-4 py-3 font-sans text-sm text-vintage-brown outline-none focus:border-vintage-gold"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-vintage-brown px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-vintage-cream transition-colors hover:bg-vintage-gold hover:text-vintage-brown"
              >
                <Plus className="h-4 w-4" /> Add category
              </button>
            </form>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const productCount = products.filter(
                  (product) => product.category === category.name,
                ).length;
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between border border-vintage-brown/10 bg-vintage-cream p-4"
                  >
                    <div>
                      <h3 className="font-serif text-xl text-vintage-brown">
                        {category.name}
                      </h3>
                      <p className="mt-1 font-sans text-xs text-vintage-light-brown">
                        {productCount} product{productCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteCategory(category.id)}
                      aria-label={`Delete ${category.name}`}
                      className="flex h-9 w-9 items-center justify-center text-vintage-light-brown transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex gap-2 border-t border-vintage-brown/10 pt-5 text-xs leading-relaxed text-vintage-light-brown">
              <AlertTriangle className="h-4 w-4 shrink-0 text-vintage-gold" />{" "}
              Deleting a category automatically moves its products to another
              available category.
            </div>
          </section>
        )}
      </div>

      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-vintage-brown/60 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={editingProductId ? "Edit product" : "Add product"}
        >
          <form
            onSubmit={saveProduct}
            className="max-h-full w-full max-w-2xl overflow-y-auto border-t-4 border-vintage-gold bg-vintage-cream p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-gold">
                  Catalog editor
                </p>
                <h2 className="mt-2 font-serif text-3xl text-vintage-brown">
                  {editingProductId ? "Edit product" : "Add product"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                aria-label="Close product editor"
                className="text-vintage-light-brown hover:text-vintage-brown"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ["name", "Product name", "text"],
                ["price", "Price", "number"],
                ["quantity", "Quantity in stock", "number"],
                ["image", "Image URL", "url"],
              ].map(([name, label, type]) => (
                <label
                  key={name}
                  className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-vintage-light-brown sm:col-span-1"
                >
                  {label}
                  <input
                    name={name}
                    type={type}
                    required
                    value={productForm[name]}
                    onChange={handleProductChange}
                    min={type === "number" ? "0" : undefined}
                    step={name === "quantity" ? "1" : type === "number" ? "0.01" : undefined}
                    className="mt-2 w-full border-b border-vintage-brown/25 bg-transparent py-3 font-sans text-base font-normal normal-case tracking-normal text-vintage-brown outline-none focus:border-vintage-gold"
                  />
                </label>
              ))}
              <label className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-vintage-light-brown sm:col-span-1">
                Category
                <select
                  name="category"
                  required
                  value={productForm.category}
                  onChange={handleProductChange}
                  className="mt-2 w-full border-b border-vintage-brown/25 bg-transparent py-3 font-sans text-base font-normal normal-case tracking-normal text-vintage-brown outline-none focus:border-vintage-gold"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-vintage-light-brown sm:col-span-2">
                Description
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={productForm.description}
                  onChange={handleProductChange}
                  className="mt-2 w-full resize-none border border-vintage-brown/15 bg-white px-3 py-2 font-sans text-sm font-normal normal-case tracking-normal text-vintage-brown outline-none focus:border-vintage-gold"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-8 inline-flex items-center gap-2 bg-vintage-brown px-7 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-cream transition-colors hover:bg-vintage-gold hover:text-vintage-brown"
            >
              <Check className="h-4 w-4" /> Save product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
