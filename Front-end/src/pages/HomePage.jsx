import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Icon from "../components/Icon";
import { api } from "../services/api";
import { useWishlist } from "../context/WishlistContext";

/* Self-hosted imagery served by the API (proxied in dev). */
const images = {
  desktopHero: "/api/images/hero/desktop-hero.jpg",
  mobileHero: "/api/images/hero/mobile-hero.jpg",
};

/* ─── Shared pieces ─────────────────────────────────────────────────────────── */

const WishlistButton = ({ product, className = "" }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(product);
      }}
      className={`flex items-center justify-center rounded-full bg-surface-container-lowest/80 backdrop-blur transition-all active:scale-90 ${
        active ? "text-primary" : "text-on-surface-variant hover:text-primary"
      } ${className}`}
    >
      <Icon name="favorite" fill={active} size={16} />
    </button>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail("");
      toast.success("You're on the list — welcome to the studio.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-stack-lg px-margin-mobile">
      <div className="relative overflow-hidden rounded-[24px] bg-primary-fixed p-stack-md text-center">
        {/* Abstract decorative shapes */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-container/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-surface-container-lowest/40 blur-2xl" />
        {subscribed ? (
          <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-3 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="check" size={24} />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-primary-fixed">
              Welcome to the studio
            </h2>
            <p className="font-body-md text-body-md text-on-primary-fixed-variant">
              Watch your inbox — subscriber-only drops are on their way.
            </p>
          </div>
        ) : (
          <>
            <h2 className="relative z-10 mb-2 font-headline-md text-headline-md text-on-primary-fixed">
              Join the Studio
            </h2>
            <p className="relative z-10 mb-6 font-body-md text-body-md text-on-primary-fixed-variant">
              Get 10% off your first custom box and exclusive artisanal updates.
            </p>
            <form
              onSubmit={handleSubmit}
              className="relative z-10 mx-auto flex max-w-md flex-col gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-tertiary focus:ring-1 focus:ring-tertiary"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-secondary-container px-6 py-3 font-label-md text-label-md text-on-secondary-container shadow-sm transition-transform active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

const ProductSkeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-[24px] bg-surface-container-low ${className}`}
  />
);

/* ─── Mobile home ──────────────────────────────────────────────────────────── */

const MobileHome = ({ products, categories, loading }) => {
  const featured = products.filter((p) => p.featured).slice(0, 3);
  const [large, ...small] = featured;

  return (
    <div className="md:hidden">
      {/* Hero */}
      <section className="flex flex-col items-center px-margin-mobile py-stack-md text-center">
        <div className="relative mb-stack-md aspect-[4/5] w-full overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(45,41,38,0.1)]">
          <img
            src={images.mobileHero}
            alt="Curated artisanal gift box"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent p-6">
            <h1 className="mb-2 font-headline-lg-mobile text-headline-lg-mobile leading-tight text-surface-container-lowest">
              Curated Joy,
              <br />
              Beautifully Boxed
            </h1>
            <p className="mb-6 font-body-lg text-body-lg text-surface-container-highest">
              Bespoke artisanal gifts for every moment.
            </p>
            <Link
              to="/shop"
              className="w-full rounded-full bg-primary px-8 py-4 font-label-md text-label-md text-on-primary shadow-[0_10px_30px_rgba(167,41,97,0.3)] transition-transform active:scale-95"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Categories pills */}
      <section className="mb-stack-lg pl-margin-mobile">
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 pr-margin-mobile">
          <Link
            to="/shop"
            className="shrink-0 rounded-full border border-tertiary/20 bg-tertiary/10 px-6 py-2 font-label-md text-label-md text-tertiary"
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="shrink-0 rounded-full bg-surface-container px-6 py-2 font-label-md text-label-md text-on-surface-variant"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured curations bento grid */}
      <section className="mb-stack-lg px-margin-mobile">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-headline-md text-headline-md text-primary">
            Featured Curations
          </h2>
          <Link
            to="/shop"
            className="flex items-center font-label-sm text-label-sm text-tertiary"
          >
            View All <Icon name="arrow_forward" size={16} className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            <ProductSkeleton className="col-span-2 aspect-video" />
            <ProductSkeleton className="aspect-square" />
            <ProductSkeleton className="aspect-square" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {large && (
              <Link
                to={`/product/${large.id}`}
                className="col-span-2 flex flex-col rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
              >
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
                  <img
                    src={large.image}
                    alt={large.name}
                    className="h-full w-full object-cover"
                  />
                  <WishlistButton
                    product={large}
                    className="absolute right-3 top-3 h-8 w-8"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 font-label-md text-label-md text-on-surface">
                      {large.name}
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {large.categories?.[0] || "Curated Set"}
                    </p>
                  </div>
                  <span className="font-label-md text-label-md text-primary">
                    ${Number(large.price).toFixed(2)}
                  </span>
                </div>
              </Link>
            )}

            {small.map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="flex flex-col rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
              >
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <WishlistButton
                    product={item}
                    className="absolute right-2 top-2 h-7 w-7"
                  />
                </div>
                <h3 className="mb-1 truncate font-label-md text-label-md text-on-surface">
                  {item.name}
                </h3>
                <span className="font-label-md text-label-md text-primary">
                  ${Number(item.price).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories horizontal scroll */}
      <section className="mb-stack-lg pl-margin-mobile">
        <h2 className="mb-4 pr-margin-mobile font-headline-md text-headline-md text-primary">
          Shop by Category
        </h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 pr-margin-mobile">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="flex w-64 shrink-0 items-center gap-4 rounded-[24px] border border-outline-variant/20 bg-surface-container-low p-4 shadow-[0_10px_30px_rgba(45,41,38,0.03)]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-container">
                {category.image ? (
                  <img
                    src={category.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-tertiary">
                    <Icon name="category" size={24} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-on-surface">
                  {category.name}
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {category.productCount}{" "}
                  {category.productCount === 1 ? "piece" : "pieces"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

/* ─── Desktop home ─────────────────────────────────────────────────────────── */

const DesktopHome = ({ products, categories, loading }) => {
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="hidden overflow-hidden md:block">
      {/* Hero */}
      <section
        className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-surface-container-low px-margin-desktop py-stack-lg"
        id="collections"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent" />
          <img
            src={images.desktopHero}
            alt="Curated gift boxes"
            className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-80"
          />
        </div>
        <div className="relative z-20 mx-auto w-full max-w-container-max">
          <div className="flex max-w-xl flex-col items-start justify-center space-y-stack-md">
            <h1 className="font-display-lg text-display-lg text-on-surface">
              Curated Joy, Beautifully Boxed
            </h1>
            <p className="max-w-lg font-body-lg text-body-lg text-on-surface-variant">
              Discover bespoke gifting experiences tailored for every meaningful
              moment. Hand-selected, artisanally crafted, and delivered with
              love.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-label-md text-label-md text-on-primary shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all hover:-translate-y-0.5 hover:bg-primary-tint"
              >
                Explore Collections
              </Link>
              <Link
                to="/info/custom-orders"
                className="inline-flex items-center justify-center rounded-xl bg-secondary-container px-8 py-4 font-label-md text-label-md text-on-secondary-container shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all hover:-translate-y-0.5 hover:bg-secondary-fixed"
              >
                Customize a Gift
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured curations */}
      <section className="mx-auto max-w-container-max px-margin-desktop py-stack-lg">
        <div className="mb-stack-md flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-headline-lg text-headline-lg text-on-surface">
              Featured Curations
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Hand-picked pieces from the current collection.
            </p>
          </div>
          <Link
            to="/shop"
            className="group flex items-center font-label-md text-label-md text-primary hover:underline"
          >
            View All
            <Icon
              name="arrow_forward"
              className="ml-1 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-gutter">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-gutter lg:grid-cols-4">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group card-hover-effect flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
              >
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-surface-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <WishlistButton
                    product={product}
                    className="absolute right-3 top-3 h-9 w-9 shadow-sm"
                  />
                </div>
                <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                  {product.categories?.[0] || "Curated Set"}
                </p>
                <span className="mt-2 font-label-md text-label-md text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-container-max px-margin-desktop py-stack-lg pb-stack-xl">
        <div className="mb-stack-md flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-headline-lg text-headline-lg text-on-surface">
              Shop by Category
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Perfectly tailored collections for life's special moments.
            </p>
          </div>
          <Link
            to="/shop"
            className="group flex items-center font-label-md text-label-md text-primary hover:underline"
          >
            View All Categories
            <Icon
              name="arrow_forward"
              className="ml-1 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden bg-surface-container">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-tertiary">
                    <Icon name="category" size={48} />
                  </div>
                )}
              </div>
              <div className="relative z-10 flex items-center justify-between bg-surface-container-lowest p-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    {category.name}
                  </h3>
                  <p className="mt-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {category.productCount}{" "}
                    {category.productCount === 1 ? "piece" : "pieces"}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  <Icon name="arrow_outward" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([items, cats]) => {
        setProducts(items);
        setCategories(cats);
      })
      .catch(() => toast.error("Couldn't load the collection."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <MobileHome
        products={products}
        categories={categories}
        loading={loading}
      />
      <DesktopHome
        products={products}
        categories={categories}
        loading={loading}
      />
    </>
  );
};

export default HomePage;
