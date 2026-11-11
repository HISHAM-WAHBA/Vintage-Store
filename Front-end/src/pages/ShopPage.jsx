import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ITEMS_PER_PAGE = 9;

/* ─── Desktop Product Card ──────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const price = Number(product.price || 0).toFixed(2);
  const category = product.categories?.[0];
  const wishlisted = isInWishlist(product.id);

  return (
    <article className="group card-hover-effect relative flex h-full cursor-pointer flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
      {/* Category chip */}
      {category && (
        <div className="absolute left-6 top-6 z-10">
          <span className="flex items-center gap-1 rounded-full border border-tertiary/20 bg-tertiary/10 px-3 py-1 font-label-sm text-label-sm text-tertiary backdrop-blur-sm">
            {category}
          </span>
        </div>
      )}

      {/* Wishlist */}
      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        onClick={(event) => {
          event.preventDefault();
          toggleWishlist(product);
        }}
        className={`absolute right-6 top-6 z-10 translate-y-2 rounded-full bg-surface-container-lowest/80 p-2 shadow-sm backdrop-blur-md transition-all duration-200 hover:text-primary group-hover:translate-y-0 group-hover:opacity-100 ${
          wishlisted
            ? "translate-y-0 text-primary opacity-100"
            : "text-on-surface-variant opacity-0"
        }`}
      >
        <Icon name="favorite" fill={wishlisted} size={18} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-lg bg-surface-container-low">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-secondary-container px-2.5 py-1 font-label-sm text-label-sm text-on-secondary-container">
              New
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <Link
              to={`/product/${product.id}`}
              className="font-headline-md text-[20px] leading-tight text-on-background transition-colors group-hover:text-primary"
            >
              {product.name}
            </Link>
            <span className="shrink-0 font-label-md text-label-md font-bold text-on-surface-variant">
              ${price}
            </span>
          </div>

          <div className="mb-3 flex items-center gap-1">
            <div className="flex text-secondary-container">
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} name="star" fill size={16} />
              ))}
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              (128)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="flex w-full translate-y-4 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-label-md text-label-md text-on-primary opacity-0 transition-all duration-300 hover:bg-primary-container group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Icon name="shopping_bag" size={18} />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

/* ─── Mobile Product Card ──────────────────────────────────────────────────── */
const MobileProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const price = Number(product.price || 0).toFixed(2);

  return (
    <article className="group relative flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute left-2 top-2 rounded-full bg-secondary-container px-2 py-1 font-label-sm text-label-sm text-on-secondary-container">
              New
            </span>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              addToCart(product);
            }}
            aria-label="Add to cart"
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition-transform active:scale-90"
          >
            <Icon name="shopping_bag" size={18} />
          </button>
        </div>
      </Link>
      <div className="mt-2 px-1">
        <Link
          to={`/product/${product.id}`}
          className="block truncate font-label-md text-label-md text-on-surface"
        >
          {product.name}
        </Link>
        <span className="font-label-md text-label-sm text-primary">
          ${price}
        </span>
      </div>
    </article>
  );
};

/* ─── Filters Panel ─────────────────────────────────────────────────────────── */
const FiltersPanel = ({
  categories,
  categoryCounts,
  selectedCategories,
  onToggleCategory,
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
  <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-stack-md shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
    {/* Header */}
    <div className="mb-stack-md flex items-center justify-between border-b border-outline-variant/30 pb-4">
      <h2 className="font-headline-md text-headline-md text-on-background text-2xl">
        Filters
      </h2>
      <button
        type="button"
        onClick={onClearAll}
        className="font-label-md text-label-md text-tertiary hover:underline"
      >
        Clear All
      </button>
    </div>

    {/* Category */}
    <fieldset className="mb-stack-md border-b border-outline-variant/30 pb-4">
      <legend className="mb-4 font-label-md text-label-sm uppercase tracking-widest text-on-surface-variant">
        Category
      </legend>
      <div className="flex flex-col gap-3">
        {categories.map((item) => {
          const isSelected = selectedCategories.has(String(item.id));
          return (
            <label
              key={item.id}
              className="group flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={isSelected}
                onChange={() => onToggleCategory(String(item.id))}
              />
              <span className="text-on-background transition-colors group-hover:text-primary">
                {item.name}
              </span>
              <span className="ml-auto font-label-sm text-sm text-on-surface-variant">
                ({categoryCounts[item.name] || 0})
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>

    {/* Price Range */}
    <fieldset className="mb-stack-md border-b border-outline-variant/30 pb-4">
      <legend className="mb-4 font-label-md text-label-sm uppercase tracking-widest text-on-surface-variant">
        Price Range
      </legend>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-sm text-on-surface-variant">
            $
          </span>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceMin}
            onChange={(event) => onPriceMinChange(event.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface py-2 pl-6 pr-2 font-body-md text-sm text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/60 focus:border-tertiary focus:ring-1 focus:ring-tertiary"
          />
        </div>
        <span className="text-on-surface-variant">–</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-sm text-on-surface-variant">
            $
          </span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceMax}
            onChange={(event) => onPriceMaxChange(event.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface py-2 pl-6 pr-2 font-body-md text-sm text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/60 focus:border-tertiary focus:ring-1 focus:ring-tertiary"
          />
        </div>
      </div>
    </fieldset>

    {/* Availability */}
    <fieldset>
      <legend className="mb-4 font-label-md text-label-sm uppercase tracking-widest text-on-surface-variant">
        Availability
      </legend>
      <div className="flex flex-col gap-3">
        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="filter-checkbox"
            checked={inStock}
            onChange={() => onInStockChange(!inStock)}
          />
          <span className="text-on-background transition-colors group-hover:text-primary">
            In Stock
          </span>
        </label>
        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="filter-checkbox"
            checked={customOrder}
            onChange={() => onCustomOrderChange(!customOrder)}
          />
          <span className="text-on-background transition-colors group-hover:text-primary">
            Custom Order
          </span>
        </label>
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
    <div className="mt-stack-lg flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-outline-variant p-2 text-on-surface-variant transition-colors hover:bg-surface-variant disabled:opacity-50"
        aria-label="Previous page"
      >
        <Icon name="chevron_left" />
      </button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="mx-1 text-on-surface-variant">...</span>
            )}
            <button
              onClick={() => onChange(p)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg font-label-md text-label-md transition-colors ${
                p === page
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-variant"
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
        className="rounded-lg border border-outline-variant p-2 text-on-surface-variant transition-colors hover:bg-surface-variant disabled:opacity-50"
        aria-label="Next page"
      >
        <Icon name="chevron_right" />
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
  const urlCategory = searchParams.get("category") || "";
  const urlSearch = searchParams.get("search") || "";

  // Multi-select categories, initialized from the URL (?category=id)
  const [selectedCategories, setSelectedCategories] = useState(
    () => new Set(urlCategory ? [urlCategory] : []),
  );

  useEffect(() => {
    setSelectedCategories(new Set(urlCategory ? [urlCategory] : []));
  }, [urlCategory]);

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
  }, [selectedCategories, sortBy, priceMin, priceMax, inStock, customOrder, searchQuery]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setSelectedCategories(new Set());
    setSearchParams({});
    setSearchQuery("");
    setPriceMin("");
    setPriceMax("");
    setInStock(true);
    setCustomOrder(true);
    setSortBy("Featured");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (searchQuery.trim()) next.set("search", searchQuery.trim());
    setSearchParams(next);
  };

  // Real product counts per category name
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      (p.categories || []).forEach((name) => {
        counts[name] = (counts[name] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let items = [...products];

    // Category filter — products store category names in `categories`
    if (selectedCategories.size > 0) {
      const selectedNames = categories
        .filter((c) => selectedCategories.has(String(c.id)))
        .map((c) => c.name.toLowerCase());
      if (selectedNames.length > 0) {
        items = items.filter((p) =>
          (p.categories || []).some((name) =>
            selectedNames.includes(String(name).toLowerCase()),
          ),
        );
      } else {
        items = [];
      }
    }

    // Search filter
    const q = (urlSearch || searchQuery).trim().toLowerCase();
    if (q) {
      items = items.filter((p) =>
        [p.name, ...(p.categories || []), p.description].some((v) =>
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

    // Availability filter (products without quantity info are kept)
    if (inStock) {
      items = items.filter(
        (p) => p.quantity == null || Number(p.quantity) > 0,
      );
    }

    // Sort
    if (sortBy === "Price: Low to High") items.sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High to Low") items.sort((a, b) => b.price - a.price);
    else if (sortBy === "Newest Arrivals") items.sort((a, b) => b.id - a.id);

    return items;
  }, [
    products,
    categories,
    selectedCategories,
    urlSearch,
    searchQuery,
    priceMin,
    priceMax,
    inStock,
    sortBy,
  ]);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const filterProps = {
    categories,
    categoryCounts,
    selectedCategories,
    onToggleCategory: toggleCategory,
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

  const subtitle = urlSearch
    ? `Search results for "${urlSearch}"`
    : selectedCategories.size > 0
      ? `Showing results in "${categories
          .filter((c) => selectedCategories.has(String(c.id)))
          .map((c) => c.name)
          .join(", ")}"`
      : "Discover bespoke, handcrafted items customized just for you.";

  return (
    <div className="min-h-screen">
      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-30 border-b border-outline-variant/30 bg-surface lg:hidden">
        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 border-b border-outline-variant/20 px-margin-mobile py-2"
        >
          <div className="relative flex-1">
            <Icon
              name="search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-outline-variant bg-surface py-2 pl-9 pr-4 font-body-md text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-tertiary"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 touch-manipulation rounded-full bg-primary px-4 py-2 font-label-sm text-label-sm text-on-primary"
          >
            Search
          </button>
        </form>

        {/* Category chips + Filter */}
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-margin-mobile py-2">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex shrink-0 touch-manipulation items-center gap-1.5 rounded-full bg-surface-container px-3 py-2 font-label-sm text-label-sm text-on-surface"
          >
            <Icon name="tune" size={14} />
            Filter
          </button>

          {categories.map((c) => {
            const isSelected = selectedCategories.has(String(c.id));
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(String(c.id))}
                className={`shrink-0 touch-manipulation rounded-full px-4 py-2 font-label-sm text-label-sm transition active:scale-95 ${
                  isSelected
                    ? "bg-tertiary/10 text-tertiary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {c.name}
              </button>
            );
          })}

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="ml-auto shrink-0 rounded-full border border-outline-variant bg-surface px-3 py-2 font-label-sm text-label-sm text-on-surface outline-none"
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
          className="fixed inset-0 z-[60] bg-inverse-surface/30 lg:hidden"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-surface p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Filters
              </h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-variant"
                aria-label="Close filters"
              >
                <Icon name="close" />
              </button>
            </div>
            <FiltersPanel {...filterProps} />
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="mt-4 w-full rounded-xl bg-primary py-3 font-label-md text-label-md text-on-primary"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="mx-auto flex min-h-screen max-w-container-max gap-gutter px-margin-mobile py-stack-md sm:py-stack-lg md:px-margin-desktop lg:py-stack-lg">
        {/* Desktop Sidebar */}
        <aside className="hidden h-fit w-64 shrink-0 lg:block">
          <div className="sticky top-28">
            <FiltersPanel {...filterProps} />
          </div>
        </aside>

        {/* Products Area */}
        <section className="min-w-0 flex-1">
          {/* Desktop header */}
          <div className="mb-stack-lg hidden items-end justify-between gap-6 lg:flex">
            <div className="min-w-0 flex-1">
              <h1 className="mb-2 whitespace-nowrap font-headline-lg text-headline-lg text-primary">
                Curated Collection
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {subtitle}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="cursor-pointer border-none bg-transparent font-body-md text-on-background outline-none focus:ring-0"
              >
                <option>Featured</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Mobile page header */}
          <div className="mb-4 lg:hidden">
            <h1 className="mb-1 font-headline-md text-[28px] leading-tight text-primary">
              Curated Collection
            </h1>
            <p className="font-body-md text-sm leading-relaxed text-on-surface-variant">
              {subtitle}
            </p>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="mb-4 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant lg:hidden">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : paginated.length > 0 ? (
            <>
              {/* Desktop Grid */}
              <div className="hidden gap-gutter lg:grid lg:grid-cols-2 xl:grid-cols-3">
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
            <div className="rounded-xl border border-dashed border-outline-variant p-12 text-center">
              <Icon
                name="filter_alt"
                className="mx-auto text-primary"
                size={32}
              />
              <h2 className="mt-4 font-headline-md text-[24px] text-on-surface">
                No items found
              </h2>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                Try adjusting your filters or search term.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 rounded-full bg-primary px-6 py-2 font-label-md text-label-sm text-on-primary"
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
