import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
    discount,
    applyDiscountCode,
    removeDiscount,
  } = useCart();
  const [codeInput, setCodeInput] = useState("");

  const subtotal = getCartTotal();
  const discountAmount = discount ? subtotal * discount.percent : 0;
  const total = subtotal - discountAmount;
  const itemCount = getCartCount();

  const handleApplyCode = (event) => {
    event.preventDefault();
    if (!codeInput.trim()) return;
    if (applyDiscountCode(codeInput)) setCodeInput("");
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-margin-mobile py-stack-lg text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
          <Icon name="shopping_bag" size={40} />
        </div>
        <h1 className="mb-2 font-headline-md text-headline-md text-on-surface">
          Your Cart is Empty
        </h1>
        <p className="mb-8 max-w-md font-body-lg text-body-lg text-on-surface-variant">
          Looks like you haven't added any treasures yet. Explore the
          collection and find something you love.
        </p>
        <Link
          to="/shop"
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
        >
          <Icon name="storefront" size={20} />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-md pb-stack-lg md:px-margin-desktop md:py-stack-lg">
      {/* Header */}
      <div className="mb-stack-md">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Your Cart
        </h1>
        <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
          {itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
        {/* ── Items (7 cols) ──────────────────────────────────────────── */}
        <section className="flex flex-col gap-stack-sm lg:col-span-7">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 soft-shadow"
            >
              <Link
                to={`/product/${item.id}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-low md:h-32"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex flex-grow flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-body-lg text-body-lg font-bold text-on-surface">
                      <Link
                        to={`/product/${item.id}`}
                        className="transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="-mr-1 -mt-1 p-1 text-on-surface-variant transition-colors hover:text-error"
                    >
                      <Icon name="close" size={20} />
                    </button>
                  </div>
                  <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                    {item.categories?.[0] || item.category || "Vintage Piece"}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  {/* Quantity control */}
                  <div className="flex items-center rounded-full bg-surface-container-low px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="p-1 text-on-surface-variant transition-colors active:text-primary"
                    >
                      <Icon name="remove" size={16} />
                    </button>
                    <span className="mx-2 w-4 text-center font-label-md text-label-md text-on-surface">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-1 text-on-surface-variant transition-colors active:text-primary"
                    >
                      <Icon name="add" size={16} />
                    </button>
                  </div>
                  <span className="font-body-lg text-body-lg font-bold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Row actions */}
          <div className="mt-4 flex items-center justify-between">
            <Link
              to="/shop"
              className="flex items-center gap-2 rounded-full px-4 py-2 font-label-md text-label-md text-tertiary transition-colors hover:bg-tertiary/10"
            >
              <Icon name="arrow_back" size={18} />
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="flex items-center gap-2 rounded-full px-4 py-2 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-error"
            >
              <Icon name="delete" size={16} />
              Clear Cart
            </button>
          </div>
        </section>

        {/* ── Order Summary (5 cols) ──────────────────────────────────── */}
        <aside className="lg:col-span-5">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 soft-shadow md:p-8 lg:sticky lg:top-24">
            <h2 className="mb-6 border-b border-outline-variant/30 pb-4 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              Order Summary
            </h2>

            {/* Discount code */}
            {discount ? (
              <div className="my-6 flex items-center justify-between rounded-lg bg-tertiary/10 px-4 py-2">
                <span className="flex items-center gap-2 font-label-md text-label-md text-tertiary">
                  <Icon name="sell" size={16} />
                  {discount.code} ({discount.percent * 100}% off)
                </span>
                <button
                  onClick={removeDiscount}
                  aria-label="Remove discount code"
                  className="text-tertiary transition-colors hover:text-error"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCode} className="my-6 flex gap-2">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value)}
                  placeholder="Discount code"
                  aria-label="Discount code"
                  className="flex-grow rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 font-body-md text-on-surface transition-colors focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-secondary px-4 py-2 font-label-md text-label-md text-on-secondary transition-colors hover:bg-secondary/90"
                >
                  Apply
                </button>
              </form>
            )}

            <div className="my-6 h-px w-full bg-outline-variant/30" />

            {/* Totals */}
            <div className="space-y-3 font-body-md text-on-surface">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discount && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Discount</span>
                  <span className="font-medium text-tertiary">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-sm font-medium text-on-surface-variant">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="my-6 h-px w-full bg-outline-variant/30" />

            <div className="mb-8 flex items-center justify-between">
              <span className="font-headline-md text-[20px] text-on-surface">
                Total
              </span>
              <div className="text-right">
                <span className="mr-2 font-label-sm text-label-sm text-on-surface-variant">
                  USD
                </span>
                <span className="font-headline-md text-[28px] text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Icon name="lock" size={18} />
              Proceed to Checkout
            </Link>
            <p className="mt-4 flex items-center justify-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <Icon name="verified_user" size={14} />
              Secure checkout powered by MockPay
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
