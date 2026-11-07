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
    <div className="min-h-screen bg-vintage-cream px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center text-sm text-vintage-light-brown transition-colors hover:text-vintage-gold"
        >
          <FiArrowLeft className="mr-2" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden border border-vintage-brown/10 bg-white p-3 sm:p-5">
            <div className="pointer-events-none absolute inset-0 m-4 border border-vintage-gold/30"></div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-vintage-gold">
              {product.category}
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-vintage-brown sm:text-5xl">
              {product.name}
            </h1>

            <div className="mb-7 flex items-center">
              <span className="font-sans text-3xl font-bold text-vintage-text">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="mb-8 font-sans text-base leading-relaxed text-vintage-text/80 sm:text-lg">
              {product.description}
            </p>

            <div className="mb-8 border-y border-vintage-brown/10 py-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex w-fit items-center border border-vintage-brown">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="px-4 py-2 text-xl transition-colors hover:bg-vintage-gold hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="px-4 py-2 text-xl transition-colors hover:bg-vintage-gold hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-vintage-brown px-8 py-3 font-sans font-bold uppercase tracking-widest text-vintage-cream transition-colors duration-300 hover:bg-vintage-gold"
                >
                  <FiShoppingBag /> Add to Cart
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-vintage-light-brown">
              <FiCheck className="text-green-600" />
              <span>In Stock - Ready to ship</span>
            </div>
            <div className="mt-7 grid grid-cols-1 gap-3 border-t border-vintage-brown/10 pt-6 text-xs uppercase tracking-[0.14em] text-vintage-light-brown sm:grid-cols-3">
              <span>Carefully packed</span>
              <span>Easy returns</span>
              <span>Tracked delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
