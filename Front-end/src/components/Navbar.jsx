import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  Home,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";
import VintageLogo from "./VintageLogo";
import { useCart } from "../context/CartContext";

const links = [
  { name: "Shop", to: "/shop" },
  { name: "about", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const bottomLinkClass = (isActive) =>
  [
    "flex min-w-16 flex-col items-center rounded-full px-4 py-1 transition-colors",
    isActive
      ? "bg-[#ffd9e3] text-[#3e001e]"
      : "text-vintage-light-brown hover:bg-vintage-pink hover:text-vintage-gold",
  ].join(" ");

const navLinkClass = (isActive) =>
  [isActive ? "text-vintage-gold border-b pd-1 border-vintage-gold" : ""].join(
    " ",
  );

const Navbar = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = getCartCount();

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-vintage-border/30 bg-vintage-cream/95 shadow-[0_10px_30px_rgba(45,41,38,0.05)] backdrop-blur">
        <div className="mx-auto hidden h-20 max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:flex lg:px-12">
          <VintageLogo className="w-16" />
          <nav className="flex items-center gap-7" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full p-2.5 text-vintage-brown transition-all duration-200 hover:bg-vintage-pink hover:text-vintage-gold hover:scale-110 active:scale-95"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <Link
              to="/cart"
              className="relative rounded-full p-2.5 text-vintage-brown transition-all duration-200 hover:bg-vintage-pink hover:text-vintage-gold hover:scale-110 active:scale-95"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-vintage-gold px-1 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full p-2.5 text-vintage-brown transition-all duration-200 hover:bg-vintage-pink hover:text-vintage-gold hover:scale-110 active:scale-95"
              aria-label="Account"
            >
              <User className="h-5 w-5" strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        <div className="flex h-[72px] items-center justify-between px-4 lg:hidden">
          <VintageLogo className="w-14" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full p-2 text-vintage-brown"
              aria-label="Search products"
            >
              <Search className="h-[21px] w-[21px]" strokeWidth={1.8} />
            </button>
            <Link
              to="/cart"
              className="relative rounded-full p-2 text-vintage-brown"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-[21px] w-[21px]" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-vintage-gold px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-vintage-brown/25 p-4 pt-20 lg:hidden"
          onClick={() => setIsSearchOpen(false)}
        >
          <form
            onSubmit={submitSearch}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto flex max-w-md items-center gap-2 rounded-2xl bg-vintage-cream p-3 shadow-xl"
          >
            <Search className="ml-2 h-5 w-5 text-vintage-light-brown" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-vintage-light-brown/70"
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="rounded-full p-2 text-vintage-light-brown"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-vintage-border bg-vintage-cream px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:hidden"
        aria-label="Mobile navigation"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) => bottomLinkClass(isActive)}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-[11px]">Home</span>
        </NavLink>
        <NavLink
          to="/shop"
          className={({ isActive }) => bottomLinkClass(isActive)}
        >
          <Store className="h-5 w-5" />
          <span className="mt-1 text-[11px]">Shop</span>
        </NavLink>
        <button type="button" className={bottomLinkClass(false)}>
          <Heart className="h-5 w-5" />
          <span className="mt-1 text-[11px]">Wishlist</span>
        </button>
        <NavLink
          to="/cart"
          className={({ isActive }) => bottomLinkClass(isActive)}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="mt-1 text-[11px]">Cart</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
