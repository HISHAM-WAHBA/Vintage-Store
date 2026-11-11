import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="mb-4 font-headline-md text-headline-md text-on-surface">
          Product Not Found
        </h2>
        <Link
          to="/shop"
          className="font-label-md text-label-md text-primary hover:underline"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const category = product.categories?.[0];
  const inStock = product.quantity == null || Number(product.quantity) > 0;
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="relative w-full">
      {/* Background accents */}
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-primary-fixed opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-secondary-fixed opacity-10 blur-3xl" />

      <main className="relative mx-auto grid w-full max-w-container-max grid-cols-1 gap-gutter px-margin-mobile py-stack-md pb-stack-lg md:px-margin-desktop lg:grid-cols-12 lg:py-stack-lg">
        {/* ── Left Column: Gallery & Description (7 cols) ─────────────── */}
        <section className="flex flex-col gap-stack-md lg:col-span-7">
          {/* Breadcrumbs */}
          <nav
            className="mb-2 flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Icon name="chevron_right" size={16} />
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
            {category && (
              <>
                <Icon name="chevron_right" size={16} />
                <span>{category}</span>
              </>
            )}
            <Icon name="chevron_right" size={16} />
            <span className="font-medium text-primary">{product.name}</span>
          </nav>

          {/* Main image */}
          <div className="group relative aspect-square overflow-hidden rounded-xl border border-primary-fixed/30 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {category && (
              <div className="absolute left-6 top-6 flex gap-2">
                <span className="rounded-full bg-tertiary/10 px-4 py-1.5 font-label-md text-label-md text-tertiary backdrop-blur-sm">
                  {category}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="mb-4 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              About this piece
            </h3>
            <p className="mb-4 font-body-md text-body-md leading-relaxed text-on-surface-variant">
              {product.description || "A handcrafted piece from our studio."}
            </p>
            <ul className="list-none space-y-2 pl-0 font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-start gap-2">
                <Icon
                  name="check"
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>Carefully packed with premium materials</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon
                  name="check"
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>Hand-selected by our artisan curators</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon
                  name="check"
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>Easy returns &amp; tracked delivery</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Right Column: Details & Actions (5 cols) ────────────────── */}
        <section className="flex flex-col gap-8 lg:col-span-5">
          {/* Product header */}
          <div className="border-b border-surface-variant pb-6">
            <h1 className="mb-2 font-headline-lg text-headline-lg text-on-surface">
              {product.name}
            </h1>
            <div className="mb-4 flex items-end gap-4">
              <span className="font-headline-md text-headline-md font-semibold text-primary">
                ${product.price ? product.price.toFixed(2) : "0.00"}
              </span>
              <span className="mb-1 font-body-md text-body-md text-on-surface-variant">
                / piece
              </span>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm">
              <div className="flex text-secondary-container">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" fill size={18} />
                ))}
              </div>
              <span className="text-on-surface-variant underline">
                124 Reviews
              </span>
            </div>
          </div>

          {/* Order card */}
          <div className="rounded-[24px] border border-white bg-surface-container-lowest/80 p-8 shadow-[0_10px_30px_rgba(45,41,38,0.05)] backdrop-blur-md">
            <h2 className="mb-8 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              Your Order
            </h2>

            {/* Quantity */}
            <div>
              <label className="mb-3 block font-label-md text-label-md text-on-surface">
                Quantity
              </label>
              <div className="flex w-32 items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-outline-variant bg-surface-container-high transition-colors hover:bg-surface-variant"
                >
                  <Icon name="remove" size={20} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(Math.max(1, Number(event.target.value) || 1))
                  }
                  className="h-10 w-12 border-x-0 border-y border-outline-variant bg-surface p-0 text-center font-body-md focus:border-tertiary focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-outline-variant bg-surface-container-high transition-colors hover:bg-surface-variant"
                >
                  <Icon name="add" size={20} />
                </button>
              </div>
            </div>

            {/* Stock status */}
            <p
              className={`mt-6 flex items-center gap-2 font-label-sm text-label-sm ${
                inStock ? "text-tertiary" : "text-error"
              }`}
            >
              <Icon name={inStock ? "check_circle" : "cancel"} size={16} />
              {inStock ? "In Stock — Ready to ship" : "Out of Stock"}
            </p>

            {/* Add to cart + wishlist */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <Icon name="shopping_bag" size={20} />
                Add to Cart — $
                {(product.price * quantity).toFixed(2)}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                aria-pressed={wishlisted}
                className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5 ${
                  wishlisted
                    ? "border-primary bg-primary-fixed text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                <Icon name="favorite" fill={wishlisted} size={22} />
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { icon: "local_shipping", label: "Free Shipping over $150" },
              { icon: "diamond", label: "Premium Materials" },
              { icon: "support_agent", label: "Artisan Support" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-secondary">
                  <Icon name={badge.icon} />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
