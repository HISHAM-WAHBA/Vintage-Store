import { Link, useSearchParams } from "react-router-dom";
import { Check, Package, ArrowRight } from "lucide-react";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  let order = null;
  try {
    order = JSON.parse(localStorage.getItem("vintage_last_order") || "null");
  } catch {
    order = null;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface px-margin-mobile py-stack-lg md:px-margin-desktop">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
          <Check className="h-10 w-10" strokeWidth={2.5} />
        </div>
        <p className="mt-8 font-label-sm text-label-sm uppercase tracking-[0.25em] text-tertiary">
          Order confirmed
        </p>
        <h1 className="mt-3 font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
          Thank you.
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
          Your order has been placed. We are already wrapping your pieces with
          care and will send updates as it travels.
        </p>

        {(orderId || order?.id) && (
          <div className="mt-8 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 text-left shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
                  Order number
                </p>
                <p className="mt-2 font-headline-md text-headline-md text-on-surface">
                  {orderId || order.id}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <Package className="h-6 w-6" />
              </div>
            </div>
            {order && (
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-5 sm:grid-cols-3">
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                    Placed
                  </p>
                  <p className="mt-1 font-body-md text-body-md text-on-surface">
                    {new Date(order.createdAt).toLocaleDateString("en", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                    Payment
                  </p>
                  <p className="mt-1 font-body-md text-body-md text-on-surface">
                    {order.paymentMethod === "cash"
                      ? "Cash on delivery"
                      : "Card payment"}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                    Total
                  </p>
                  <p className="mt-1 font-body-md text-body-md font-bold text-primary">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-8 py-3 font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
