import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { FiArrowLeft, FiShoppingBag, FiCheck } from "react-icons/fi";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center bg-vintage-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vintage-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center bg-vintage-cream text-vintage-brown">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Link to="/shop" className="underline hover:text-vintage-gold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-vintage-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center text-vintage-light-brown hover:text-vintage-gold mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-[4/5] bg-white p-4 shadow-xl rotate-1">
            <div className="absolute inset-0 border-4 border-vintage-gold/20 m-4 pointer-events-none"></div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-vintage-gold tracking-[0.2em] uppercase text-sm font-bold mb-2">
              {product.category}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-vintage-brown mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center mb-8">
              <span className="text-3xl font-sans text-vintage-text font-bold">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="font-sans text-lg text-vintage-text/80 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="border-t border-b border-vintage-gold/20 py-8 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-vintage-brown rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-xl hover:bg-vintage-gold hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-xl hover:bg-vintage-gold hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-vintage-brown text-vintage-cream px-8 py-3 uppercase tracking-widest font-bold hover:bg-vintage-gold transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <FiShoppingBag /> Add to Cart
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-vintage-light-brown">
              <FiCheck className="text-green-600" />
              <span>In Stock - Ready to ship</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
