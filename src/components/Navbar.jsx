import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import VintageLogo from "../components/VintageLogo";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const getThemeVars = () => {
    if (scrolled || isOpen || !isHomePage) {
      return {
        bg: "bg-vintage-cream/95 backdrop-blur-md border-b border-vintage-gold/20 shadow-sm",
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
        className={`fixed top-0 w-full z-50 transition-all duration-500 py-6 ${
          scrolled || isOpen || !isHomePage
            ? "bg-vintage-cream/95 backdrop-blur-md border-b border-vintage-gold/20 shadow-sm !py-2"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center md:hidden z-50 relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 focus:outline-none transition-colors ${theme.text} ${theme.textHover}`}
              >
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                  {isOpen ? (
                    <X size={26} strokeWidth={1.5} />
                  ) : (
                    <Menu size={26} strokeWidth={1.5} />
                  )}
                </motion.div>
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none relative z-50">
              <div
                stroke={theme.logoColor}
                className="h-12 flex justify-center w-full fill-current transition-colors duration-500"
              >
                <VintageLogo
                  className={`w-40 md:w-48 transform transition-all duration-500`}
                />
              </div>
            </div>

            <div className="hidden md:flex flex-1 justify-center space-x-12">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-sans text-xs tracking-[0.2em] uppercase transition-colors duration-300 relative group font-medium ${
                      isActive
                        ? theme.activeText
                        : `${theme.text} ${theme.textHover}`
                    }`
                  }
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-2 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${theme.lineColor}`}
                  ></span>
                </NavLink>
              ))}
            </div>

            <div
              className={`flex items-center space-x-6 z-50 relative transition-colors duration-500 ${theme.text}`}
            >
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`hover:scale-110 transition-transform cursor-pointer hidden sm:block ${theme.textHover}`}
              >
                <Search size={22} strokeWidth={1.5} />
              </button>
              <Link
                to="/auth"
                className={`hover:scale-110 transition-transform cursor-pointer hidden sm:block ${theme.textHover}`}
              >
                <User size={22} strokeWidth={1.5} />
              </Link>
              <Link
                to="/cart"
                className={`hover:scale-110 transition-transform relative ${theme.textHover}`}
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                <AnimatePresence>
                  {getCartCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-vintage-gold rounded-full px-1 shadow-sm font-sans"
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
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "100vh", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 w-full bg-vintage-cream border-b border-vintage-gold/20 overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-8 pt-20">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                  >
                    <Link
                      to={link.path}
                      className="block text-4xl font-serif text-vintage-brown hover:text-vintage-gold transition-colors text-center"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 w-full bg-vintage-cream border-b border-vintage-gold/20 overflow-hidden shadow-xl z-40"
            >
              <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    className="w-full bg-transparent border-b-2 border-vintage-gold/30 pl-10 pr-12 py-4 text-vintage-brown font-serif text-2xl focus:outline-none focus:border-vintage-gold transition-colors"
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
    </>
  );
};

export default Navbar;
