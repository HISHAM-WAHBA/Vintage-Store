import { Link, useSearchParams } from "react-router-dom";
import { Check, Package, ArrowRight } from "lucide-react";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const order = JSON.parse(
    localStorage.getItem("vintage_last_order") || "null",
  );

  return (
    <div className="min-h-[70vh] bg-vintage-cream px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-vintage-gold text-vintage-brown">
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <p className="mt-8 font-sans text-xs font-bold uppercase tracking-[0.25em] text-vintage-gold">
          Order confirmed
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-vintage-brown sm:text-7xl">
          Thank you.
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-vintage-light-brown sm:text-lg">
          Your order is safely on its way to becoming part of your story. We
          will be in touch with delivery updates.
        </p>

        <div className="mx-auto mt-10 max-w-md border-t-2 border-vintage-brown bg-white p-6 text-left shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-vintage-brown/10 pb-5">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-vintage-light-brown">
              Order number
            </span>
            <span className="font-sans text-sm font-bold text-vintage-brown">
              {orderId || order?.id || "VT-PENDING"}
            </span>
          </div>
          {order && (
            <div className="space-y-3 pt-5 font-sans text-sm text-vintage-text">
              <div className="flex justify-between">
                <span>Items</span>
                <span>
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment</span>
                <span>
                  {order.paymentMethod === "cash"
                    ? "Cash on delivery"
                    : "Card payment"}
                </span>
              </div>
              <div className="flex justify-between border-t border-vintage-brown/10 pt-4 font-bold text-vintage-brown">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-vintage-brown px-7 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-cream transition-colors hover:bg-vintage-gold hover:text-vintage-brown"
          >
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-light-brown transition-colors hover:text-vintage-gold"
          >
            <Package className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
