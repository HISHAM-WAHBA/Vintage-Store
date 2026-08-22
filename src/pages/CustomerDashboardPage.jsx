import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

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

const CustomerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vintage_profile") || "{}");
    } catch {
      return {};
    }
  });
  const orders = getOrders();
  const lastOrder = orders[0];
  const totalItems = orders.reduce(
    (total, order) =>
      total + order.items.reduce((items, item) => items + item.quantity, 0),
    0,
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "profile", label: "Profile" },
  ];

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = () => {
    localStorage.setItem("vintage_profile", JSON.stringify(profile));
  };

  return (
    <div className="min-h-screen bg-vintage-cream px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-vintage-brown/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-vintage-gold">
              Your account
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-none text-vintage-brown sm:text-6xl">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-vintage-light-brown sm:text-base">
              Keep track of your treasures, orders, and account details in one
              place.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-3 border-b border-vintage-brown pb-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-brown transition-colors hover:border-vintage-gold hover:text-vintage-gold"
          >
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/admin"
            className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-light-brown transition-colors hover:text-vintage-gold"
          >
            Store admin
          </Link>
        </div>

        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-vintage-brown/10 [scrollbar-width:none] sm:gap-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 border-b-2 pb-4 font-sans text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                activeTab === tab.id
                  ? "border-vintage-gold text-vintage-brown"
                  : "border-transparent text-vintage-light-brown hover:text-vintage-brown"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
              {[
                { label: "Orders", value: orders.length, icon: Package },
                { label: "Items bought", value: totalItems, icon: ShoppingBag },
                {
                  label: "Last order",
                  value: lastOrder ? formatDate(lastOrder.createdAt) : "None",
                  icon: CalendarDays,
                },
                {
                  label: "Member status",
                  value: "Collector",
                  icon: CircleUserRound,
                },
              ].map(({ label, value, icon: DashboardIcon }) => (
                <div
                  key={label}
                  className="border border-vintage-brown/10 bg-white p-4 sm:p-6"
                >
                  <DashboardIcon
                    className="h-5 w-5 text-vintage-gold"
                    strokeWidth={1.6}
                  />
                  <p className="mt-6 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-vintage-light-brown">
                    {label}
                  </p>
                  <p className="mt-2 truncate font-serif text-xl text-vintage-brown sm:text-2xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {lastOrder ? (
              <section className="border-t-4 border-vintage-gold bg-white p-5 sm:p-8">
                <div className="flex flex-col justify-between gap-4 border-b border-vintage-brown/10 pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-light-brown">
                      Latest order
                    </p>
                    <h2 className="mt-2 font-serif text-3xl text-vintage-brown">
                      {lastOrder.id}
                    </h2>
                  </div>
                  <span className="w-fit bg-vintage-gold/15 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-vintage-brown">
                    Confirmed
                  </span>
                </div>
                <div className="grid gap-5 pt-6 sm:grid-cols-3">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.12em] text-vintage-light-brown">
                      Placed
                    </p>
                    <p className="mt-2 font-sans text-sm text-vintage-brown">
                      {formatDate(lastOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.12em] text-vintage-light-brown">
                      Payment
                    </p>
                    <p className="mt-2 font-sans text-sm text-vintage-brown">
                      {lastOrder.paymentMethod === "cash"
                        ? "Cash on delivery"
                        : "Card payment"}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.12em] text-vintage-light-brown">
                      Total
                    </p>
                    <p className="mt-2 font-sans text-sm font-bold text-vintage-brown">
                      ${lastOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="mt-7 inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-vintage-brown transition-colors hover:text-vintage-gold"
                >
                  View order history <ChevronRight className="h-4 w-4" />
                </button>
              </section>
            ) : (
              <section className="border border-dashed border-vintage-brown/20 bg-white/50 px-6 py-14 text-center sm:py-20">
                <Package
                  className="mx-auto h-10 w-10 text-vintage-gold"
                  strokeWidth={1.4}
                />
                <h2 className="mt-5 font-serif text-3xl text-vintage-brown">
                  Your story starts here.
                </h2>
                <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-vintage-light-brown">
                  You have no orders yet. Explore the collection and find
                  something worth keeping.
                </p>
                <Link
                  to="/shop"
                  className="mt-7 inline-flex items-center gap-3 bg-vintage-brown px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-cream transition-colors hover:bg-vintage-gold hover:text-vintage-brown"
                >
                  Explore collection <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [
                  Truck,
                  "Delivery updates",
                  "Follow every order from our door to yours.",
                ],
                [
                  CreditCard,
                  "Payment details",
                  "Your preferred payment method stays close at hand.",
                ],
                [
                  CircleUserRound,
                  "Personal details",
                  "Keep your contact information ready for checkout.",
                ],
              ].map(([DashboardIcon, title, text]) => (
                <button
                  key={title}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      title === "Personal details" ? "profile" : "orders",
                    )
                  }
                  className="flex items-start gap-4 border border-vintage-brown/10 bg-vintage-cream p-5 text-left transition-colors hover:border-vintage-gold"
                >
                  <DashboardIcon
                    className="h-5 w-5 shrink-0 text-vintage-gold"
                    strokeWidth={1.6}
                  />
                  <span>
                    <strong className="block font-serif text-xl font-normal text-vintage-brown">
                      {title}
                    </strong>
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-vintage-light-brown">
                      {text}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <section className="mt-8 border-t-4 border-vintage-gold bg-white p-5 sm:p-8">
            <div className="flex items-end justify-between gap-4 border-b border-vintage-brown/10 pb-5">
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-gold">
                  Your history
                </p>
                <h2 className="mt-2 font-serif text-3xl text-vintage-brown">
                  Orders
                </h2>
              </div>
              <span className="font-sans text-xs text-vintage-light-brown">
                {orders.length} total
              </span>
            </div>
            {orders.length > 0 ? (
              <div className="divide-y divide-vintage-brown/10">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-serif text-xl text-vintage-brown">
                        {order.id}
                      </p>
                      <p className="mt-1 font-sans text-xs text-vintage-light-brown">
                        {formatDate(order.createdAt)} · {order.items.length}{" "}
                        product{order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-8 sm:justify-end">
                      <span className="bg-vintage-gold/15 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-vintage-brown">
                        Confirmed
                      </span>
                      <strong className="font-sans text-sm text-vintage-brown">
                        ${order.total.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-16 text-center font-sans text-sm text-vintage-light-brown">
                No orders to display yet.
              </p>
            )}
          </section>
        )}

        {activeTab === "profile" && (
          <section className="mt-8 max-w-2xl border-t-4 border-vintage-gold bg-white p-5 sm:p-8">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-gold">
              Account settings
            </p>
            <h2 className="mt-2 font-serif text-3xl text-vintage-brown">
              Personal details
            </h2>
            <div className="mt-8 space-y-6">
              {[
                ["fullName", "Full name"],
                ["email", "Email address"],
                ["phone", "Phone number"],
                ["address", "Default address"],
              ].map(([name, label]) => (
                <label
                  key={label}
                  className="block font-sans text-xs font-bold uppercase tracking-[0.14em] text-vintage-light-brown"
                >
                  {label}
                  <input
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    value={profile[name] || ""}
                    onChange={handleProfileChange}
                    placeholder={label}
                    className="mt-2 w-full border-b border-vintage-brown/25 bg-transparent py-3 font-sans text-base font-normal normal-case tracking-normal text-vintage-brown outline-none transition-colors placeholder:text-vintage-light-brown/60 focus:border-vintage-gold"
                  />
                </label>
              ))}
              <button
                type="button"
                onClick={saveProfile}
                className="bg-vintage-brown px-7 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-vintage-cream transition-colors hover:bg-vintage-gold hover:text-vintage-brown"
              >
                Save details
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
