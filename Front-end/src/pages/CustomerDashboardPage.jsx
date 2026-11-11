import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Heart,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Icon from "../components/Icon";
import { api, getStoredToken } from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

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
  const token = getStoredToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vintage_profile") || "{}");
    } catch {
      return {};
    }
  });
  const [orders, setOrders] = useState(getOrders);
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Signed-in customers get their real order history and profile from the
  // backend; guests keep using the localStorage copies written at checkout.
  useEffect(() => {
    if (!getStoredToken()) return undefined;
    let cancelled = false;

    api
      .getMyOrders()
      .then((data) => {
        if (!cancelled && data.length > 0) setOrders(data);
      })
      .catch((error) => {
        if (error?.status === 401 || !getStoredToken()) {
          toast.error("Your session ended. Please sign in again.", { id: "session-expired" });
          navigate("/auth?next=/dashboard", { replace: true });
        }
      });

    api
      .getProfile()
      .then((user) => {
        if (cancelled) return;
        setProfile((current) => ({
          ...current,
          fullName: user.name,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
        }));
      })
      .catch((error) => {
        if (error?.status === 401 || !getStoredToken()) {
          toast.error("Your session ended. Please sign in again.", { id: "session-expired" });
          navigate("/auth?next=/dashboard", { replace: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);
  const lastOrder = orders[0];
  const totalItems = orders.reduce(
    (total, order) =>
      total + order.items.reduce((items, item) => items + item.quantity, 0),
    0,
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "wishlist", label: `Wishlist (${wishlist.length})` },
    { id: "profile", label: "Profile" },
  ];

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async () => {
    localStorage.setItem("vintage_profile", JSON.stringify(profile));
    if (!getStoredToken()) {
      toast.error("Your session ended. Please sign in again.", { id: "session-expired" });
      navigate("/auth?next=/dashboard", { replace: true });
      return;
    }
    try {
      await api.updateProfile({
        name: profile.fullName,
        phone: profile.phone,
        address: profile.address,
      });
      toast.success("Details saved");
    } catch (error) {
      if (error?.status === 401 || !getStoredToken()) {
        toast.error("Your session ended. Please sign in again.", { id: "session-expired" });
        navigate("/auth?next=/dashboard", { replace: true });
      } else {
        toast.error(error.message);
      }
    }
  };

  if (!token) {
    return (
      <Navigate
        to={`/auth?next=${encodeURIComponent(location.pathname || "/dashboard")}`}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface px-margin-mobile py-stack-lg text-on-surface md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <div className="flex flex-col justify-between gap-6 border-b border-outline-variant/40 pb-stack-md sm:flex-row sm:items-end">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-tertiary">
              Your account
            </p>
            <h1 className="mt-3 font-headline-lg text-headline-lg-mobile leading-none text-on-surface md:text-headline-lg">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-lg font-body-md text-body-md text-on-surface-variant">
              Keep track of your treasures, orders, and account details in one
              place.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant px-6 py-2.5 font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-outline-variant/40 pb-2 [scrollbar-width:none] sm:gap-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 border-b-2 pb-4 font-label-md text-label-md transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Orders", value: orders.length, icon: Package },
                { label: "Wishlist", value: wishlist.length, icon: Heart },
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
                  className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)] sm:p-6"
                >
                  <DashboardIcon
                    className="h-5 w-5 text-primary"
                    strokeWidth={1.6}
                  />
                  <p className="mt-6 font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                    {label}
                  </p>
                  <p className="mt-2 truncate font-headline-md text-headline-md text-on-surface">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {lastOrder ? (
              <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(45,41,38,0.05)] sm:p-8">
                <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/40 pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
                      Latest order
                    </p>
                    <h2 className="mt-2 font-headline-md text-headline-md text-on-surface">
                      {lastOrder.id}
                    </h2>
                  </div>
                  <span className="w-fit rounded-full bg-tertiary/10 px-3 py-1.5 font-label-sm text-label-sm text-tertiary">
                    {lastOrder.status || "Confirmed"}
                  </span>
                </div>
                <div className="grid gap-5 pt-6 sm:grid-cols-3">
                  <div>
                    <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                      Placed
                    </p>
                    <p className="mt-2 font-body-md text-body-md text-on-surface">
                      {formatDate(lastOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                      Payment
                    </p>
                    <p className="mt-2 font-body-md text-body-md text-on-surface">
                      {lastOrder.paymentMethod === "cash"
                        ? "Cash on delivery"
                        : "Card payment"}
                    </p>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm uppercase tracking-[0.12em] text-on-surface-variant">
                      Total
                    </p>
                    <p className="mt-2 font-body-md text-body-md font-bold text-primary">
                      ${Number(lastOrder.total).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="mt-7 inline-flex items-center gap-2 font-label-md text-label-md text-primary transition-colors hover:underline"
                >
                  View order history <ChevronRight className="h-4 w-4" />
                </button>
              </section>
            ) : (
              <section className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low px-6 py-14 text-center sm:py-20">
                <Package
                  className="mx-auto h-10 w-10 text-primary"
                  strokeWidth={1.4}
                />
                <h2 className="mt-5 font-headline-md text-headline-md text-on-surface">
                  Your story starts here.
                </h2>
                <p className="mx-auto mt-3 max-w-md font-body-md text-body-md text-on-surface-variant">
                  You have no orders yet. Explore the collection and find
                  something worth keeping.
                </p>
                <Link
                  to="/shop"
                  className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
                >
                  Explore collection <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  Heart,
                  "Wishlist",
                  `${wishlist.length} saved ${wishlist.length === 1 ? "piece" : "pieces"} in your account.`,
                  "wishlist",
                ],
                [
                  Truck,
                  "Delivery updates",
                  "Follow every order from our door to yours.",
                  "orders",
                ],
                [
                  CreditCard,
                  "Payment details",
                  "Your preferred payment method stays close at hand.",
                  "orders",
                ],
                [
                  CircleUserRound,
                  "Personal details",
                  "Keep your contact information ready for checkout.",
                  "profile",
                ],
              ].map(([DashboardIcon, title, text, tab]) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="flex items-start gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 text-left shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all hover:-translate-y-0.5"
                >
                  <DashboardIcon
                    className="h-5 w-5 shrink-0 text-primary"
                    strokeWidth={1.6}
                  />
                  <span>
                    <strong className="block font-headline-md text-headline-md text-on-surface">
                      {title}
                    </strong>
                    <span className="mt-1 block font-body-md text-body-md text-on-surface-variant">
                      {text}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <section className="mt-8 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(45,41,38,0.05)] sm:p-8">
            <div className="flex items-end justify-between gap-4 border-b border-outline-variant/40 pb-5">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
                  Your history
                </p>
                <h2 className="mt-2 font-headline-md text-headline-md text-on-surface">
                  Orders
                </h2>
              </div>
              <span className="font-body-md text-body-md text-on-surface-variant">
                {orders.length} total
              </span>
            </div>
            {orders.length > 0 ? (
              <div className="divide-y divide-outline-variant/30">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-headline-md text-headline-md text-on-surface">
                        {order.id}
                      </p>
                      <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                        {formatDate(order.createdAt)} · {order.items.length}{" "}
                        product{order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-8 sm:justify-end">
                      <span className="rounded-full bg-tertiary/10 px-3 py-1.5 font-label-sm text-label-sm text-tertiary">
                        {order.status || "Confirmed"}
                      </span>
                      <strong className="font-body-md text-body-md text-primary">
                        ${Number(order.total).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-16 text-center font-body-md text-body-md text-on-surface-variant">
                No orders to display yet.
              </p>
            )}
          </section>
        )}

        {activeTab === "wishlist" && (
          <section className="mt-8 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(45,41,38,0.05)] sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/40 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
                  Saved in your account
                </p>
                <h2 className="mt-2 font-headline-md text-headline-md text-on-surface">
                  Wishlist
                </h2>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                  {wishlist.length === 0
                    ? "Pieces you love will appear here."
                    : `${wishlist.length} ${wishlist.length === 1 ? "piece" : "pieces"} saved for later.`}
                </p>
              </div>
              <Link
                to="/wishlist"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant px-5 py-2.5 font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary"
              >
                Open wishlist page <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                  <Heart className="h-6 w-6" />
                </div>
                <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
                  Your wishlist is empty. Tap the heart on any product to save it here.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
                >
                  Explore collection <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {wishlist.map((product) => (
                  <article
                    key={product.id}
                    className="flex gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${product.id}`}
                        className="block truncate font-label-md text-label-md text-on-surface hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                        {product.categories?.[0] || "Vintage"}
                      </p>
                      <p className="mt-2 font-label-md text-label-md text-primary">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={product.quantity <= 0}
                          onClick={() => addToCart(product, 1)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-label-sm text-label-sm text-on-primary transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                        >
                          <Icon name="shopping_bag" size={14} />
                          {product.quantity <= 0 ? "Out of stock" : "Add to cart"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant px-3 py-1.5 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-error hover:text-error"
                        >
                          <Icon name="delete" size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "profile" && (
          <section className="mt-8 max-w-2xl rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(45,41,38,0.05)] sm:p-8">
            <p className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
              Account settings
            </p>
            <h2 className="mt-2 font-headline-md text-headline-md text-on-surface">
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
                  className="block font-label-md text-label-md text-on-surface-variant"
                >
                  {label}
                  <input
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    value={profile[name] || ""}
                    onChange={handleProfileChange}
                    placeholder={label}
                    className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>
              ))}
              <button
                type="button"
                onClick={saveProfile}
                className="rounded-full bg-primary px-7 py-3 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
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
