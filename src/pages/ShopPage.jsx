import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import { FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest First");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          api.getCategories(),
          currentCategory === "All" || !currentCategory
            ? api.getProducts()
            : api.getProductsByCategory(currentCategory),
        ]);
        setCategories(cats);

        let filteredProds = [...prods];

        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredProds = filteredProds.filter(
            (p) =>
              p.name.toLowerCase().includes(lowerQuery) ||
              (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
              (p.description &&
                p.description.toLowerCase().includes(lowerQuery)),
          );
        }

        // Apply Sorting
        if (sortBy === "Price: Low to High") {
          filteredProds.sort((a, b) => a.price - b.price);
        } else if (sortBy === "Price: High to Low") {
          filteredProds.sort((a, b) => b.price - a.price);
        } else if (sortBy === "Newest First") {
          filteredProds.sort((a, b) => b.id - a.id); // Assuming higher ID is newer
        }

        setProducts(filteredProds);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentCategory, searchQuery, sortBy]);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", catId);
    }
    setSearchParams(newParams);
    setIsFilterOpen(false); // Close dropdown after selection
  };

  return (
    <div className="bg-vintage-cream min-h-screen">
      <div className="bg-vintage-brown text-vintage-cream py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-serif text-5xl md:text-7xl mb-4 relative z-10"
        >
          {searchQuery ? `"${searchQuery}"` : "The Collection"}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-sans text-vintage-gold tracking-[0.3em] uppercase text-xs md:text-sm relative z-10"
        >
          Curated artifacts & timeless goods
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter & Sort Controls */}
        <div className="mb-12 border-b border-vintage-gold/20 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-3 px-6 py-3 border border-vintage-brown transition-all duration-300 font-sans uppercase tracking-widest text-xs font-bold ${
                  isFilterOpen || currentCategory !== "All"
                    ? "bg-vintage-brown text-vintage-cream"
                    : "text-vintage-brown hover:bg-vintage-brown hover:text-white"
                }`}
              >
                <FiFilter className={isFilterOpen ? "animate-pulse" : ""} />
                <span>{currentCategory === "All" ? "Filter By Category" : `Category: ${currentCategory}`}</span>
                <motion.span
                  animate={{ rotate: isFilterOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.span>
              </button>

              {currentCategory !== "All" && (
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="text-vintage-light-brown hover:text-vintage-gold text-xs uppercase tracking-widest font-bold underline underline-offset-4"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-vintage-brown">
              <span className="font-sans text-xs uppercase tracking-widest opacity-60">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-vintage-gold/30 focus:outline-none focus:border-vintage-gold py-1 pr-8 font-sans text-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw1IDVMOSAxIiBzdHJva2U9IiMzZTI3MjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_center]"
              >
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-4 py-3 text-center transition-all duration-300 font-sans text-xs uppercase tracking-widest border border-vintage-gold/10 ${
                        currentCategory.toLowerCase() === cat.id.toLowerCase() ||
                        (currentCategory === "All" && cat.id === "all")
                          ? "bg-vintage-gold text-white border-vintage-gold shadow-lg transform -translate-y-1"
                          : "bg-white/50 text-vintage-brown hover:border-vintage-gold/40 hover:bg-white"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <main>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-vintage-gold"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-vintage-brown/10"></div>
                </div>
              </div>
              <p className="mt-6 font-serif italic text-vintage-light-brown animate-pulse">Uncovering treasures...</p>
            </div>
          ) : (
            <>
              <div className="mb-10 flex items-center gap-4">
                <span className="h-[1px] flex-1 bg-vintage-gold/20"></span>
                <span className="font-serif italic text-vintage-light-brown">
                  Showing {products.length} {products.length === 1 ? "Artifact" : "Artifacts"}
                </span>
                <span className="h-[1px] flex-1 bg-vintage-gold/20"></span>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index % 3 * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white/30 rounded-lg border border-dashed border-vintage-gold/30">
                  <div className="inline-block p-6 rounded-full bg-vintage-cream mb-6">
                    <FiFilter size={40} className="text-vintage-gold/40" />
                  </div>
                  <p className="text-2xl text-vintage-brown font-serif italic mb-2">
                    {searchQuery
                      ? `No treasures found matching "${searchQuery}".`
                      : "The vaults are empty in this category."}
                  </p>
                  <p className="text-vintage-light-brown font-sans text-sm mb-8">Try adjusting your search or category filters.</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="px-8 py-3 bg-vintage-brown text-white font-sans uppercase tracking-[0.2em] text-xs hover:bg-vintage-gold transition-colors duration-500 shadow-xl"
                  >
                    Explore All Treasures
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>

  );
};

export default ShopPage;
