import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";

const getOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("vintage_orders") || "[]");
  } catch {
    return [];
  }
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const OrdersPage = () => {
  const orders = getOrders();

  return (
    <div className="min-h-screen bg-vintage-cream px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-vintage-brown/10 pb-8">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-vintage-gold">
            Your history
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-none text-vintage-brown sm:text-6xl">
            Orders
          </h1>
          <p className="mt-4 font-sans text-sm text-vintage-light-brown">
            Every treasure you have chosen, all in one place.
          </p>
        </div>
        {orders.length > 0 ? (
          <div className="mt-8 divide-y divide-vintage-brown/10 border-t-4 border-vintage-gold bg-white px-5 sm:px-8">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex flex-col gap-5 py-6 transition-colors hover:bg-vintage-cream sm:flex-row sm:items-center sm:justify-between sm:px-3"
              >
                <div className="flex items-start gap-4">
                  <Package className="mt-1 h-5 w-5 shrink-0 text-vintage-gold" />
                  <div>
                    <h2 className="font-serif text-xl text-vintage-brown">
                      {order.id}
                    </h2>
                    <p className="mt-1 font-sans text-xs text-vintage-light-brown">
                      {formatDate(order.createdAt)} · {order.items.length}{" "}
                      product{order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-8 sm:justify-end">
                  <span className="bg-vintage-gold/15 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-vintage-brown">
                    {order.status || "Processing"}
                  </span>
                  <strong className="font-sans text-sm text-vintage-brown">
                    ${order.total.toFixed(2)}
                  </strong>
                  <ArrowRight className="h-4 w-4 text-vintage-light-brown" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-vintage-brown/20 bg-white/50 px-6 py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-vintage-gold" />
            <h2 className="mt-5 font-serif text-3xl text-vintage-brown">
              No orders yet.
            </h2>
            <Link
              to="/shop"
              className="mt-7 inline-flex bg-vintage-brown px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-cream"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
