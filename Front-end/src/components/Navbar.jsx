import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import VintageLogo from "./VintageLogo";
import Icon from "./Icon";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const links = [
  { name: "Shop", to: "/shop" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const navLinkClass = ({ isActive }) =>
  [
    "font-body-md text-body-md transition-colors duration-200",
    isActive
      ? "text-primary font-bold border-b-2 border-primary pb-1"
      : "text-on-surface-variant font-medium hover:text-primary",
  ].join(" ");

const bottomLinkClass = ({ isActive }) =>
  [
    "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 transition-all duration-200 active:scale-95",
    isActive
      ? "bg-primary-fixed text-on-primary-fixed-variant [&_.material-symbols-outlined]:text-primary [&_span:last-child]:font-bold"
      : "text-on-surface-variant hover:text-primary",
  ].join(" ");

const Navbar = () => {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
        {/* ── Desktop / Tablet navbar ─────────────────────────────── */}
        <div className="mx-auto hidden h-20 max-w-container-max items-center justify-between px-margin-desktop md:flex">
          <VintageLogo className="h-10 w-auto" />

          <nav className="flex items-center gap-8" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={navLinkClass}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full p-2 text-on-surface transition-colors hover:bg-surface-variant hover:text-primary"
              aria-label="Search products"
            >
              <Icon name="search" />
            </button>
            <Link
              to="/wishlist"
              className="relative rounded-full p-2 text-on-surface transition-colors hover:bg-surface-variant hover:text-primary"
              aria-label="Wishlist"
            >
              <Icon name="favorite" />
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-tertiary text-[10px] font-bold text-on-tertiary">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative rounded-full p-2 text-on-surface transition-colors hover:bg-surface-variant hover:text-primary"
              aria-label="Shopping cart"
            >
              <Icon name="shopping_cart" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full p-2 text-on-surface transition-colors hover:bg-surface-variant hover:text-primary"
              aria-label="Account"
            >
              <Icon name="person" />
            </Link>
          </div>
        </div>

        {/* ── Mobile top bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-margin-mobile py-3 md:hidden">
          <Link to="/" aria-label="Vintage home" className="flex items-center">
            <VintageLogo className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              aria-label="Search products"
            >
              <Icon name="search" />
            </button>
            <Link
              to="/wishlist"
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              aria-label="Wishlist"
            >
              <Icon name="favorite" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-tertiary px-1 text-[10px] font-bold text-on-tertiary">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              aria-label="Shopping cart"
            >
              <Icon name="shopping_bag" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile/Desktop search overlay ──────────────────────────── */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-inverse-surface/25 p-4 pt-24"
          onClick={() => setIsSearchOpen(false)}
        >
          <form
            onSubmit={submitSearch}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto flex max-w-md items-center gap-2 rounded-2xl bg-surface p-3 shadow-xl"
          >
            <Icon name="search" className="ml-2 text-on-surface-variant" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent py-2 font-body-md text-sm outline-none placeholder:text-on-surface-variant/70"
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="rounded-full p-2 text-on-surface-variant"
              aria-label="Close search"
            >
              <Icon name="close" />
            </button>
          </form>
        </div>
      )}

      {/* ── Mobile bottom navigation ───────────────────────────────── */}
      <nav
        className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-outline-variant/40 bg-surface/95 shadow-[0_12px_35px_rgba(45,41,38,0.18)] backdrop-blur-md md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch gap-1 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <NavLink to="/" end className={bottomLinkClass}>
            <Icon name="home" className="text-[22px]" />
            <span className="font-label-sm text-[11px] leading-none">Home</span>
          </NavLink>
          <NavLink to="/shop" className={bottomLinkClass}>
            <Icon name="storefront" className="text-[22px]" />
            <span className="font-label-sm text-[11px] leading-none">Shop</span>
          </NavLink>
          <NavLink to="/wishlist" className={bottomLinkClass}>
            <span className="relative">
              <Icon name="favorite" className="text-[22px]" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-tertiary px-1 text-[9px] font-bold text-on-tertiary">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span className="font-label-sm text-[11px] leading-none">Wishlist</span>
          </NavLink>
          <NavLink to="/cart" className={bottomLinkClass}>
            <span className="relative">
              <Icon name="shopping_bag" className="text-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-on-primary">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="font-label-sm text-[11px] leading-none">Cart</span>
          </NavLink>
          <NavLink to="/dashboard" className={bottomLinkClass}>
            <Icon name="person" className="text-[22px]" />
            <span className="font-label-sm text-[11px] leading-none">Account</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
