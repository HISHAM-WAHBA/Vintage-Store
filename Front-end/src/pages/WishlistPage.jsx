import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-lg pb-stack-xl md:px-margin-desktop">
      {/* Header */}
      <div className="mb-stack-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-tertiary">
            Saved for later
          </p>
          <h1 className="mt-2 font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Your Wishlist
          </h1>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            {wishlist.length === 0
              ? "Pieces you love, gathered in one place."
              : `${wishlist.length} ${wishlist.length === 1 ? "piece" : "pieces"} waiting for you.`}
          </p>
        </div>
        {wishlist.length > 0 && (
          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant px-6 py-2.5 font-label-md text-label-md text-on-surface transition-all hover:border-primary hover:text-primary"
          >
            <Icon name="add" size={16} />
            Keep browsing
          </Link>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed-variant">
            <Icon name="favorite" size={30} />
          </div>
          <h2 className="mt-6 font-headline-md text-headline-md text-on-surface">
            Nothing saved yet.
          </h2>
          <p className="mt-2 max-w-md font-body-md text-body-md text-on-surface-variant">
            Tap the heart on any piece to keep it here while you think it over.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Explore the collection
            <Icon name="arrow_forward" size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <article
              key={product.id}
              className="group card-hover-effect relative flex h-full flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
            >
              <Link
                to={`/product/${product.id}`}
                className="relative mb-4 block aspect-square w-full overflow-hidden rounded-lg bg-surface-container"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <button
                type="button"
                onClick={() => removeFromWishlist(product.id)}
                aria-label={`Remove ${product.name} from wishlist`}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest/90 text-primary shadow-sm backdrop-blur transition-transform active:scale-90"
              >
                <Icon name="favorite" fill size={18} />
              </button>

              <Link to={`/product/${product.id}`} className="flex grow flex-col">
                <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                  {product.categories?.[0] || "Vintage"}
                </p>
                <span className="mt-2 font-label-md text-label-md text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
              </Link>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={product.quantity <= 0}
                  onClick={() => addToCart(product, 1)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary transition-all duration-200 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Icon name="shopping_bag" size={16} />
                  {product.quantity <= 0 ? "Out of stock" : "Add to cart"}
                </button>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-error hover:text-error"
                >
                  <Icon name="delete" size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
