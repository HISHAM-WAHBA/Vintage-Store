import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import { FiFilter } from "react-icons/fi";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

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

        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          setProducts(
            prods.filter(
              (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
                (p.description &&
                  p.description.toLowerCase().includes(lowerQuery)),
            ),
          );
        } else {
          setProducts(prods);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentCategory, searchQuery]);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", catId);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-vintage-cream min-h-screen">
      <div className="bg-vintage-brown text-vintage-cream py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
        <h1 className="font-serif text-5xl mb-2 relative z-10">
          {searchQuery ? `Search Results: "${searchQuery}"` : "The Collection"}
        </h1>
        <p className="font-sans text-vintage-gold tracking-widest uppercase text-sm relative z-10">
          Curated artifacts & timeless goods
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-vintage-brown border-b border-vintage-gold/30 pb-2">
                <FiFilter />
                <h3 className="font-serif text-xl">Filters</h3>
              </div>

              <div className="space-y-2">
                <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-vintage-light-brown mb-3">
                  Categories
                </h4>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`block w-full text-left px-3 py-2 rounded-sm transition-colors duration-200 font-sans ${
                      currentCategory.toLowerCase() === cat.id.toLowerCase() ||
                      (currentCategory === "All" && cat.id === "all")
                        ? "bg-vintage-gold text-white shadow-md"
                        : "text-vintage-text hover:bg-vintage-gold/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vintage-gold"></div>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center text-sm text-vintage-light-brown font-sans">
                  <span>Showing {products.length} results</span>
                  <select className="bg-transparent border-b border-vintage-light-brown focus:outline-none focus:border-vintage-gold pb-1 text-vintage-text">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl text-vintage-light-brown font-serif italic">
                      {searchQuery
                        ? `No treasures found matching "${searchQuery}".`
                        : "No treasures found in this category."}
                    </p>
                    <button
                      onClick={() => setSearchParams({})}
                      className="mt-4 text-vintage-text underline hover:text-vintage-gold"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
