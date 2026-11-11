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
    "flex flex-col items-center justify-center rounded-full px-4 py-1 active:scale-95 transition-all duration-200",
    isActive
      ? "bg-primary-fixed text-on-primary-fixed [&_.material-symbols-outlined]:text-primary [&_.material-symbols-outlined]:font-bold [&_span:last-child]:text-primary [&_span:last-child]:font-bold"
      : "text-on-surface-variant",
  ].join(" ");

const Navbar = () => {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <header className="sticky top-0 z-50 w-full bg-surface shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
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
        <div className="flex items-center justify-between px-margin-mobile py-4 md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="text-2xl text-on-surface-variant"
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
          <VintageLogo className="h-10 w-auto" />
          <div className="flex items-center gap-3">            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-2xl text-on-surface-variant"
              aria-label="Search products"
            >
              <Icon name="search" />
            </button>
            <Link
              to="/cart"
              className="relative text-2xl text-on-surface-variant"
              aria-label="Shopping cart"
            >
              <Icon name="shopping_bag" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile menu drawer ─────────────────────────────────────── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-inverse-surface/30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-surface p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <VintageLogo className="h-9 w-auto" />
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-variant"
                aria-label="Close menu"
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="flex flex-col gap-2" aria-label="Mobile menu">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 font-body-md text-body-md transition-colors ${
                      isActive
                        ? "bg-primary-fixed text-on-primary-fixed font-bold"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              >
                My Wishlist
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              >
                My Account
              </NavLink>
            </nav>
          </div>
        </div>
      )}

      {/* ── Mobile search overlay ──────────────────────────────────── */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-inverse-surface/25 p-4 pt-24 md:hidden"
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
        className="fixed inset-x-0 bottom-0 z-50 w-full rounded-t-xl border-t border-outline-variant bg-surface pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-4 py-3">
          <NavLink to="/" end className={bottomLinkClass}>
            <Icon name="home" />
            <span className="font-label-sm text-label-sm">Home</span>
          </NavLink>
          <NavLink to="/shop" className={bottomLinkClass}>
            <Icon name="search" />
            <span className="font-label-sm text-label-sm">Shop</span>
          </NavLink>
          <NavLink to="/wishlist" className={bottomLinkClass}>
            <span className="relative">
              <Icon name="favorite" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-tertiary text-[9px] font-bold text-on-tertiary">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span className="font-label-sm text-label-sm">Wishlist</span>
          </NavLink>
          <NavLink to="/cart" className={bottomLinkClass}>
            <Icon name="shopping_bag" />
            <span className="font-label-sm text-label-sm">Cart</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
