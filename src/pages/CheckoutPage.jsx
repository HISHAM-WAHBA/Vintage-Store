import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";

const shippingFee = 12;

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const subtotal = getCartTotal();
  const total = subtotal + shippingFee;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const order = {
      id: `VT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "Processing",
      customer: formData,
      paymentMethod,
      items: cart,
      subtotal,
      shipping: shippingFee,
      total,
    };

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
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-vintage-cream px-5 text-center">
        <h1 className="font-serif text-4xl text-vintage-brown">
          Nothing to check out yet.
        </h1>
        <p className="mt-4 text-vintage-light-brown">
          Add a few treasures to your bag first.
        </p>
        <Link
          to="/shop"
          className="mt-8 bg-vintage-gold px-7 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-brown"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm text-vintage-light-brown transition-colors hover:text-vintage-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <div className="mb-10">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-vintage-gold">
            Almost yours
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-none text-vintage-brown sm:text-6xl">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <form onSubmit={handleSubmit} className="space-y-10">
            <section className="border-t-2 border-vintage-brown pt-6">
              <h2 className="font-serif text-3xl text-vintage-brown">
                Delivery details
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  ["fullName", "Full name", "text"],
                  ["email", "Email address", "email"],
                  ["phone", "Phone number", "tel"],
                  ["city", "City", "text"],
                ].map(([name, label, type]) => (
                  <label
                    key={name}
                    className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-vintage-light-brown"
                  >
                    {label}
                    <input
                      name={name}
                      type={type}
                      required
                      value={formData[name]}
                      onChange={handleChange}
                      className="mt-2 w-full border-b border-vintage-brown/25 bg-transparent px-0 py-3 font-sans text-base font-normal normal-case tracking-normal text-vintage-brown outline-none transition-colors focus:border-vintage-gold"
                    />
                  </label>
                ))}
                <label className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-vintage-light-brown sm:col-span-2">
                  Delivery address
                  <input
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-2 w-full border-b border-vintage-brown/25 bg-transparent px-0 py-3 font-sans text-base font-normal normal-case tracking-normal text-vintage-brown outline-none transition-colors focus:border-vintage-gold"
                  />
                </label>
                <label className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-vintage-light-brown sm:col-span-2">
                  Order notes{" "}
                  <span className="font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="mt-2 w-full resize-none border-b border-vintage-brown/25 bg-transparent px-0 py-3 font-sans text-base font-normal normal-case tracking-normal text-vintage-brown outline-none transition-colors focus:border-vintage-gold"
                  />
                </label>
              </div>
            </section>

            <section className="border-t-2 border-vintage-brown pt-6">
              <h2 className="font-serif text-3xl text-vintage-brown">
                Payment
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["cash", "Cash on delivery", "Pay when your order arrives."],
                  ["card", "Card payment", "Secure card payment at checkout."],
                ].map(([value, title, description]) => (
                  <label
                    key={value}
                    className={`cursor-pointer border p-4 transition-colors ${paymentMethod === value ? "border-vintage-gold bg-vintage-gold/10" : "border-vintage-brown/15 bg-white"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="sr-only"
                    />
                    <span className="font-sans text-sm font-bold text-vintage-brown">
                      {title}
                    </span>
                    <span className="mt-1 block font-sans text-xs text-vintage-light-brown">
                      {description}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <button
              type="submit"
              className="flex min-h-14 w-full items-center justify-center gap-3 bg-vintage-brown px-6 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-vintage-cream transition-colors hover:bg-vintage-gold hover:text-vintage-brown sm:w-fit sm:px-10"
            >
              <Lock className="h-4 w-4" /> Place order
            </button>
          </form>

          <aside className="h-fit border-t-4 border-vintage-gold bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-28">
            <h2 className="border-b border-vintage-brown/10 pb-5 font-serif text-2xl text-vintage-brown">
              Your order
            </h2>
            <div className="my-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-14 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base text-vintage-brown">
                      {item.name}
                    </p>
                    <p className="mt-1 font-sans text-xs text-vintage-light-brown">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-sans text-sm font-bold text-vintage-brown">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-vintage-brown/10 pt-5 font-sans text-sm text-vintage-text">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-vintage-brown/10 pt-4 font-bold text-vintage-brown">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2 border-t border-vintage-brown/10 pt-5 text-xs leading-relaxed text-vintage-light-brown">
              <ShieldCheck className="h-4 w-4 shrink-0 text-vintage-gold" />{" "}
              Your details are used only to process this order.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
