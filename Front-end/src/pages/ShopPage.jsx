import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

const ITEMS_PER_PAGE = 9;

/* ─── Product Card ─────────────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const price = Number(product.price || 0).toFixed(2);

  return (
    <article className="group relative flex cursor-pointer flex-col rounded-xl border border-vintage-border/20 bg-white p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(45,41,38,0.08)]">
      {/* Wishlist */}
      <button
        type="button"
        aria-label="Add to wishlist"
        className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-vintage-light-brown opacity-0 shadow-sm backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:text-vintage-gold"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-lg bg-vintage-pink">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-vintage-mustard px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6d4f00]">
              New
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col">
        <div className="mb-1 flex items-start justify-between gap-2">
          <Link
            to={`/product/${product.id}`}
            className="font-serif text-[18px] leading-tight text-vintage-brown transition-colors group-hover:text-vintage-gold"
          >
            {product.name}
          </Link>
          <span className="shrink-0 text-sm font-semibold text-vintage-light-brown">
            ${price}
          </span>
        </div>

        {/* Stars */}
        <div className="mb-3 flex items-center gap-1">
          <div className="flex text-vintage-mustard">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs text-vintage-light-brown">(128)</span>
        </div>

        {/* Add to Cart — slides up on hover */}
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-vintage-gold py-3 text-sm font-semibold text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#8a0e4c]"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

/* ─── Mobile Product Card ───────────────────────────────────────────────────── */
const MobileProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const price = Number(product.price || 0).toFixed(2);

  return (
    <article className="group relative flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-vintage-pink">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute left-2 top-2 rounded-full bg-vintage-mustard px-2 py-1 text-[10px] font-bold uppercase text-[#6d4f00]">
              New
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            aria-label="Add to cart"
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-vintage-gold text-white shadow-md"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </Link>
      <div className="mt-2 px-1">
        <Link
          to={`/product/${product.id}`}
          className="block truncate text-sm font-semibold text-vintage-brown"
        >
          {product.name}
        </Link>
        <span className="text-sm text-vintage-gold font-semibold">
          ${price}
        </span>
      </div>
    </article>
  );
};

/* ─── Filters Panel ─────────────────────────────────────────────────────────── */
const FiltersPanel = ({
  categories,
  category,
  onPickCategory,
  onClearAll,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  inStock,
  customOrder,
  onInStockChange,
  onCustomOrderChange,
}) => (
  <div className="rounded-xl border border-vintage-border/30 bg-white p-6 shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
    {/* Header */}
    <div className="mb-6 flex items-center justify-between border-b border-vintage-border/40 pb-4">
      <h2 className="font-serif text-2xl font-bold text-vintage-brown">
        Filters
      </h2>
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-vintage-accent hover:underline"
      >
        Clear All
      </button>
    </div>

    {/* Category */}
    <fieldset className="border-b border-vintage-border/40 pb-5 mb-5">
      <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-vintage-light-brown">
        Category
      </legend>
      <div className="flex flex-col gap-3">
        {/* All Products */}
        <button
          type="button"
          onClick={() => onPickCategory("all")}
          className="flex w-full cursor-pointer items-center gap-3 text-left group touch-manipulation"
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
              category === "all"
                ? "border-vintage-gold bg-vintage-gold"
                : "border-vintage-border group-hover:border-vintage-gold"
            }`}
          >
            {category === "all" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          <span
            className={`text-sm transition-colors ${
              category === "all"
                ? "font-semibold text-vintage-gold"
                : "text-vintage-brown group-hover:text-vintage-gold"
            }`}
          >
            All Products
          </span>
        </button>

        {/* Category items */}
        {categories.map((item) => {
          const isSelected =
            category.toLowerCase() === String(item.id).toLowerCase();
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPickCategory(item.id)}
              className="flex w-full cursor-pointer items-center gap-3 text-left group touch-manipulation"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? "border-vintage-gold bg-vintage-gold"
                    : "border-vintage-border group-hover:border-vintage-gold"
                }`}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span
                className={`text-sm transition-colors ${
                  isSelected
                    ? "font-semibold text-vintage-gold"
                    : "text-vintage-brown group-hover:text-vintage-gold"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>

    {/* Price Range */}
    <fieldset className="border-b border-vintage-border/40 pb-5 mb-5">
      <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-vintage-light-brown">
        Price Range
      </legend>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-vintage-light-brown">
            $
          </span>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            className="w-full rounded-lg border border-vintage-border bg-vintage-cream pl-7 pr-2 py-2 text-sm outline-none focus:border-vintage-accent focus:ring-1 focus:ring-vintage-accent/30 transition-colors"
          />
        </div>
        <span className="text-vintage-light-brown">–</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-vintage-light-brown">
            $
          </span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            className="w-full rounded-lg border border-vintage-border bg-vintage-cream pl-7 pr-2 py-2 text-sm outline-none focus:border-vintage-accent focus:ring-1 focus:ring-vintage-accent/30 transition-colors"
          />
        </div>
      </div>
    </fieldset>

    {/* Availability */}
    <fieldset>
      <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-vintage-light-brown">
        Availability
      </legend>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onInStockChange(!inStock)}
          className="flex w-full cursor-pointer items-center gap-3 text-left group touch-manipulation"
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
              inStock
                ? "border-vintage-accent bg-vintage-accent text-white"
                : "border-vintage-border group-hover:border-vintage-accent"
            }`}
          >
            {inStock && <span className="text-[10px] font-bold">✓</span>}
          </span>
          <span
            className={`text-sm transition-colors ${
              inStock
                ? "font-medium text-vintage-brown"
                : "text-vintage-light-brown group-hover:text-vintage-brown"
            }`}
          >
            In Stock
          </span>
        </button>

        <button
          type="button"
          onClick={() => onCustomOrderChange(!customOrder)}
          className="flex w-full cursor-pointer items-center gap-3 text-left group touch-manipulation"
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
              customOrder
                ? "border-vintage-accent bg-vintage-accent text-white"
                : "border-vintage-border group-hover:border-vintage-accent"
            }`}
          >
            {customOrder && <span className="text-[10px] font-bold">✓</span>}
          </span>
          <span
            className={`text-sm transition-colors ${
              customOrder
                ? "font-medium text-vintage-brown"
                : "text-vintage-light-brown group-hover:text-vintage-brown"
            }`}
          >
            Custom Order
          </span>
        </button>
      </div>
    </fieldset>
  </div>
);

/* ─── Pagination ────────────────────────────────────────────────────────────── */
const Pagination = ({ page, total, perPage, onChange }) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-vintage-border p-2.5 text-vintage-light-brown transition hover:bg-vintage-pink disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="px-1 text-vintage-light-brown">...</span>
            )}
            <button
              onClick={() => onChange(p)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                p === page
                  ? "bg-vintage-gold text-white"
                  : "text-vintage-light-brown hover:bg-vintage-pink"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-vintage-border p-2.5 text-vintage-light-brown transition hover:bg-vintage-pink disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

/* ─── Main ShopPage ─────────────────────────────────────────────────────────── */
const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStock, setInStock] = useState(true);
  const [customOrder, setCustomOrder] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);

  // Keep selectedCategory in sync with URL searchParams
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  // Sync URL search with local state on mount
  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProducts()])
      .then(([cats, items]) => {
        setCategories(cats);
        setProducts(items);
      })
      .finally(() => setLoading(false));
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    sortBy,
    priceMin,
    priceMax,
    inStock,
    customOrder,
    searchQuery,
  ]);

  const pickCategory = (id) => {
    setSelectedCategory(id);
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    next.delete("search");
    setSearchQuery("");
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => {
    setSelectedCategory("all");
    setSearchParams({});
    setSearchQuery("");
    setPriceMin("");
    setPriceMax("");
    setInStock(true);
    setCustomOrder(true);
    setSortBy("Featured");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (searchQuery.trim()) next.set("search", searchQuery.trim());
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    let items = [...products];

    // Category filter — match by category name since products store names
    if (selectedCategory !== "all") {
      const cat = categories.find(
        (c) => c.id.toLowerCase() === selectedCategory.toLowerCase(),
      );
      if (cat) {
        items = items.filter(
          (p) =>
            String(p.category || "").toLowerCase() === cat.name.toLowerCase(),
        );
      } else {
        items = [];
      }
    }

    // Search filter
    const q = (urlSearch || searchQuery).trim().toLowerCase();
    if (q) {
      items = items.filter((p) =>
        [p.name, p.category, p.description].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }

    // Price filter
    if (priceMin !== "")
      items = items.filter((p) => p.price >= Number(priceMin));
    if (priceMax !== "")
      items = items.filter((p) => p.price <= Number(priceMax));

    // Sort
    if (sortBy === "Low to High") items.sort((a, b) => a.price - b.price);
    else if (sortBy === "High to Low") items.sort((a, b) => b.price - a.price);
    else if (sortBy === "Newest Arrivals") items.sort((a, b) => b.id - a.id);

    return items;
  }, [
    products,
    categories,
    selectedCategory,
    urlSearch,
    searchQuery,
    priceMin,
    priceMax,
    sortBy,
  ]);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const filterProps = {
    categories,
    category: selectedCategory,
    onPickCategory: pickCategory,
    onClearAll: clearAll,
    priceMin,
    priceMax,
    onPriceMinChange: setPriceMin,
    onPriceMaxChange: setPriceMax,
    inStock,
    customOrder,
    onInStockChange: setInStock,
    onCustomOrderChange: setCustomOrder,
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <div className="lg:hidden border-b border-vintage-border/40 bg-white sticky top-[72px] z-30">
        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 px-4 py-2 border-b border-vintage-border/20"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-vintage-light-brown" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-vintage-border bg-vintage-cream py-2 pl-9 pr-4 text-sm outline-none focus:border-vintage-accent"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-vintage-gold px-4 py-2 text-xs font-semibold text-white touch-manipulation"
          >
            Search
          </button>
        </form>

        {/* Category chips + Filter + Sort */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-vintage-pink px-3 py-2 text-xs font-semibold text-vintage-brown touch-manipulation"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </button>

          {/* Category pills */}
          <button
            type="button"
            onClick={() => pickCategory("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition active:scale-95 touch-manipulation ${
              selectedCategory === "all"
                ? "bg-vintage-gold text-white"
                : "bg-vintage-pink text-vintage-light-brown"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pickCategory(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition active:scale-95 touch-manipulation ${
                selectedCategory === String(c.id)
                  ? "bg-vintage-gold text-white"
                  : "bg-vintage-pink text-vintage-light-brown"
              }`}
            >
              {c.name}
            </button>
          ))}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-auto shrink-0 rounded-full border border-vintage-border bg-vintage-cream px-3 py-2 text-xs outline-none"
          >
            <option>Featured</option>
            <option>Newest Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ────────────────────────────────────── */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-[60] bg-vintage-brown/30 lg:hidden"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-vintage-brown">
                Filters
              </h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="rounded-full p-2 hover:bg-vintage-pink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FiltersPanel {...filterProps} />
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="mt-4 w-full rounded-xl bg-vintage-gold py-3 font-semibold text-white"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-8 lg:flex lg:gap-6 lg:px-12 lg:py-12">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28">
            <FiltersPanel {...filterProps} />
          </div>
        </aside>

        {/* Products Area */}
        <section className="min-w-0 flex-1">
          {/* Desktop header */}
          <div className="mb-12 hidden items-end justify-between gap-6 lg:flex">
            <div className="min-w-0 flex-1">
              <h1 className="whitespace-nowrap font-serif text-[48px] font-bold leading-[56px] tracking-[-0.01em] text-vintage-gold mb-2">
                Curated Collection
              </h1>
              <p className="font-sans text-[18px] leading-[28px] text-vintage-light-brown">
                {urlSearch
                  ? `Search results for "${urlSearch}"`
                  : selectedCategory !== "all"
                    ? `Showing results in "${categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}"`
                    : "Discover bespoke, handcrafted items customized just for you."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 bg-white px-4 py-2.5 rounded-lg border border-vintage-border/30 shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
              <span className="text-sm font-semibold text-vintage-light-brown">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer bg-transparent text-base font-medium text-vintage-brown outline-none pr-1 focus:ring-0 border-none"
              >
                <option>Featured</option>
                <option>Newest Arrivals</option>
                <option>Low to High</option>
                <option>High to Low</option>
              </select>
            </div>
          </div>

          {/* Mobile page header */}
          <div className="mb-4 lg:hidden">
            <h1 className="font-serif text-3xl font-bold leading-tight text-vintage-gold mb-1">
              Curated Collection
            </h1>
            <p className="font-sans text-sm leading-relaxed text-vintage-light-brown">
              {urlSearch
                ? `Search results for "${urlSearch}"`
                : selectedCategory !== "all"
                  ? `Showing results in "${categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}"`
                  : "Discover bespoke, handcrafted items customized just for you."}
            </p>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-vintage-light-brown lg:hidden">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-vintage-gold border-t-transparent" />
            </div>
          ) : paginated.length > 0 ? (
            <>
              {/* Desktop Grid */}
              <div className="hidden grid-cols-2 gap-6 lg:grid xl:grid-cols-3">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Mobile Grid */}
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {paginated.map((product) => (
                  <MobileProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                total={filtered.length}
                perPage={ITEMS_PER_PAGE}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-vintage-border p-12 text-center">
              <Filter className="mx-auto h-8 w-8 text-vintage-gold" />
              <h2 className="mt-4 font-serif text-2xl text-vintage-brown">
                No items found
              </h2>
              <p className="mt-2 text-sm text-vintage-light-brown">
                Try adjusting your filters or search term.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 rounded-full bg-vintage-gold px-6 py-2 text-sm font-semibold text-white"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ShopPage;
