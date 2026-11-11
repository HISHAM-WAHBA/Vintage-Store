import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Icon from "../components/Icon";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

const shippingFee = 12;

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary";

const CHECKOUT_STEPS = [
  { label: "Information", state: "done" },
  { label: "Shipping", state: "done" },
  { label: "Payment", state: "active" },
];

const PAYMENT_OPTIONS = [
  {
    value: "cash",
    icon: "local_shipping",
    title: "Cash on Delivery",
    desc: "Pay when your order arrives.",
  },
  {
    value: "card",
    icon: "credit_card",
    title: "Card Payment",
    desc: "Secure card payment at checkout.",
  },
];

const CheckoutPage = () => {
  const {
    cart,
    getCartTotal,
    clearCart,
    discount,
    applyDiscountCode,
    removeDiscount,
  } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [codeInput, setCodeInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
  });

  const subtotal = getCartTotal();
  const discountAmount = discount ? subtotal * discount.percent : 0;
  const total = subtotal - discountAmount + shippingFee;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleApplyCode = (event) => {
    event.preventDefault();
    if (!codeInput.trim()) return;
    if (applyDiscountCode(codeInput)) setCodeInput("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // The backend recomputes every total from database prices — the cart
      // only carries product ids and quantities.
      const order = await api.createOrder({
        customer: { ...formData },
        paymentMethod,
        items: cart.map(({ id, quantity }) => ({ id, quantity })),
        discountCode: discount ? discount.code : null,
      });

      // Keep the localStorage copies so the success page and the customer
      // dashboard work for guests too (no account required).
      localStorage.setItem("vintage_last_order", JSON.stringify(order));
      localStorage.setItem(
        "vintage_orders",
        JSON.stringify([
          order,
          ...JSON.parse(localStorage.getItem("vintage_orders") || "[]"),
        ]),
      );
      clearCart();
      navigate(`/order-success?order=${order.id}`);
    } catch (error) {
      toast.error(error.message || "We couldn't place your order.");
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-margin-mobile py-stack-lg text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
          <Icon name="shopping_bag" size={40} />
        </div>
        <h1 className="mb-2 font-headline-md text-headline-md text-on-surface">
          Nothing to check out yet.
        </h1>
        <p className="mb-8 max-w-md font-body-lg text-body-lg text-on-surface-variant">
          Add a few treasures to your bag first.
        </p>
        <Link
          to="/shop"
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
        >
          <Icon name="storefront" size={20} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-md pb-stack-lg md:px-margin-desktop md:py-stack-lg">
      {/* Header */}
      <div className="mb-stack-md">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Secure Checkout
        </h1>
        <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
          Complete your bespoke order.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
        {/* ── Left Column: Checkout Details (7 cols) ─────────────────── */}
        <div className="space-y-stack-md lg:col-span-7">
          {/* Progress Indicators */}
          <div className="mb-stack-md flex items-start justify-between px-4">
            {CHECKOUT_STEPS.map((step, index) => (
              <Fragment key={step.label}>
                {index > 0 && (
                  <div
                    className={`relative z-0 mx-2 mt-[18px] h-1 flex-grow ${
                      step.state === "done"
                        ? "bg-tertiary"
                        : step.state === "active"
                          ? "bg-primary-fixed-dim"
                          : "bg-outline-variant/30"
                    }`}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${
                      step.state === "done"
                        ? "bg-tertiary text-on-tertiary"
                        : step.state === "active"
                          ? "bg-primary text-on-primary"
                          : "border border-outline-variant bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    <Icon
                      name={step.state === "done" ? "check" : "lock"}
                      size={18}
                    />
                  </div>
                  <span
                    className={`font-label-sm text-label-sm ${
                      step.state === "active"
                        ? "font-semibold text-primary"
                        : step.state === "done"
                          ? "font-semibold text-tertiary"
                          : "text-on-surface-variant"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 soft-shadow md:p-8"
          >
            <h2 className="mb-6 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+20 100 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="my-8 h-px w-full bg-outline-variant/30" />

            <h2 className="mb-6 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="firstName"
                  className="font-label-md text-label-md text-on-surface"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Sophia"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="lastName"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Artisan"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label
                  htmlFor="address"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="123 Craft Lane, Suite A"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="city"
                  className="font-label-md text-label-md text-on-surface"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder="Portland"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="zip"
                  className="font-label-md text-label-md text-on-surface"
                >
                  ZIP Code
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  placeholder="97204"
                  value={formData.zip}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="my-8 h-px w-full bg-outline-variant/30" />

            <h2 className="mb-6 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === option.value
                      ? "border-primary bg-primary-fixed/20"
                      : "border-outline-variant bg-surface-container-low hover:border-outline"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        paymentMethod === option.value
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      <Icon name={option.icon} size={20} />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="font-label-md text-label-md text-on-surface">
                        {option.title}
                      </span>
                      <span className="font-body-md text-[14px] leading-5 text-on-surface-variant">
                        {option.desc}
                      </span>
                    </span>
                    {paymentMethod === option.value && (
                      <Icon
                        name="check_circle"
                        fill
                        size={20}
                        className="ml-auto shrink-0 text-primary"
                      />
                    )}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <label
                htmlFor="notes"
                className="font-label-md text-label-md text-on-surface"
              >
                Order notes{" "}
                <span className="font-body-md text-body-md font-normal normal-case tracking-normal text-on-surface-variant">
                  (optional)
                </span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                placeholder="Anything we should know about your delivery?"
                value={formData.notes}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Link
                to="/cart"
                className="flex items-center justify-center rounded-full px-6 py-3 font-label-md text-label-md text-tertiary transition-colors hover:bg-tertiary/10"
              >
                Return to Cart
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
              >
                <Icon name={isSubmitting ? "progress_activity" : "lock"} size={18} />
                {isSubmitting
                  ? "Placing your order…"
                  : `Place Order — $${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right Column: Order Summary (5 cols) ─────────────────────── */}
        <div className="relative lg:col-span-5">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 soft-shadow md:p-8 lg:sticky lg:top-24">
            <h2 className="mb-6 border-b border-outline-variant/30 pb-4 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-low">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-grow flex-col justify-between py-1">
                    <div>
                      <h3 className="mb-1 line-clamp-1 font-label-md text-[16px] leading-5 text-on-surface">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-tertiary/10 px-3 py-1 font-label-sm text-label-sm text-tertiary">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-label-md text-label-md text-on-surface">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                <span className="font-medium">${shippingFee.toFixed(2)}</span>
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

            <p className="flex gap-2 font-label-sm text-label-sm leading-4 text-on-surface-variant">
              <Icon name="shield" size={16} className="shrink-0 text-tertiary" />
              Your details are used only to process this order.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
