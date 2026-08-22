import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  Info,
  Mail,
  Search,
  ShoppingBag,
  Store,
  User,
  X,
} from "lucide-react";
import VintageLogo from "../components/VintageLogo";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const getThemeVars = () => {
    if (scrolled || !isHomePage) {
      return {
        bg: "bg-vintage-cream/95 backdrop-blur-md border-b border-vintage-brown/10 shadow-sm",
        text: "text-vintage-brown",
        textHover: "hover:text-vintage-gold",
        logoColor: "var(--color-vintage-brown)",
        lineColor: "bg-vintage-gold",
        activeText: "text-vintage-gold",
      };
    } else {
      // Home page
      return {
        bg: "bg-transparent",
        text: "text-vintage-cream/80",
        textHover: "hover:text-white",
        logoColor: "var(--color-vintage-gold)",
        lineColor: "bg-white",
        activeText: "text-white",
      };
    }
  };

  const theme = getThemeVars();

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${theme.bg}`}
      >
        <div className="border-b border-white/15 bg-vintage-brown px-3 py-2 text-center font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-vintage-cream/80 sm:text-[10px] sm:tracking-[0.28em]">
          Curated objects for everyday rituals
        </div>
        <div className="mx-auto max-w-[90rem] px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-[4.5rem] md:h-[5.25rem]">
            <div className="w-10 lg:hidden" aria-hidden="true" />

            <div className="absolute left-3 z-50 flex translate-x-0 items-center justify-center sm:left-6 lg:relative lg:left-auto lg:flex-none">
              <div
                stroke={theme.logoColor}
                className="flex h-12 w-full justify-center fill-current transition-colors duration-500"
              >
                <VintageLogo className="w-28 transform transition-all duration-500 sm:w-32 md:w-40" />
              </div>
            </div>

            <div className="hidden flex-1 justify-center gap-10 lg:flex lg:gap-14">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsSearchOpen(false)}
                  className={({ isActive }) =>
                    `group relative font-sans text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${
                      isActive
                        ? theme.activeText
                        : `${theme.text} ${theme.textHover}`
                    }`
                  }
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${theme.lineColor}`}
                  ></span>
                </NavLink>
              ))}
            </div>

            <div
              className={`relative z-50 flex items-center gap-1 transition-colors duration-500 sm:gap-2 md:gap-3 ${theme.text}`}
            >
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
                className={`cursor-pointer p-2 transition-transform hover:scale-110 ${theme.textHover}`}
              >
                <Search
                  className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                  strokeWidth={1.8}
                />
              </button>
              <Link
                to="/dashboard"
                aria-label="Account"
                className={`cursor-pointer p-2 transition-transform hover:scale-110 ${theme.textHover}`}
              >
                <User
                  className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                  strokeWidth={1.8}
                />
              </Link>
              <Link
                to="/cart"
                aria-label="Shopping bag"
                className={`relative cursor-pointer p-2 transition-transform hover:scale-110 ${theme.textHover}`}
              >
                <ShoppingBag
                  className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
                  strokeWidth={1.8}
                />
                <AnimatePresence>
                  {getCartCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-vintage-gold px-1 font-sans text-[9px] font-bold text-white shadow-sm sm:-right-2 sm:-top-2 sm:h-[18px] sm:min-w-[18px] sm:text-[10px]"
                    >
                      {getCartCount()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-full z-40 w-full overflow-hidden border-b border-vintage-brown/10 bg-vintage-cream shadow-xl"
            >
              <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center max-w-3xl mx-auto"
                >
                  <Search
                    className="absolute left-0 text-vintage-light-brown"
                    size={24}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artifacts, categories..."
                    className="w-full border-b-2 border-vintage-gold/30 bg-transparent py-3 pl-9 pr-10 font-serif text-xl text-vintage-brown transition-colors placeholder:text-vintage-light-brown/70 focus:border-vintage-gold focus:outline-none sm:py-4 sm:text-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-0 text-vintage-light-brown hover:text-vintage-brown transition-colors"
                  >
                    <X size={28} />
                  </button>
                  <button type="submit" className="hidden">
                    Submit
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-vintage-brown/10 bg-vintage-cream/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(36,35,31,0.08)] backdrop-blur-lg lg:hidden">
        <div className="mx-auto grid h-[4.25rem] max-w-md grid-cols-4 px-2">
          {[
            { ...navLinks[0], icon: House },
            { ...navLinks[1], icon: Store },
            { ...navLinks[2], icon: Info },
            { ...navLinks[3], icon: Mail },
          ].map(({ name, path, icon: NavIcon }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setIsSearchOpen(false)}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  isActive ? "text-vintage-gold" : "text-vintage-light-brown"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <NavIcon
                    className={`h-5 w-5 ${isActive ? "stroke-[2]" : "stroke-[1.6]"}`}
                  />
                  <span className="truncate">{name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
