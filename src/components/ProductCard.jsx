import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative transition-all duration-500 rounded-sm flex flex-col h-full bg-transparent">
      <div className="relative aspect-[4/5] overflow-hidden bg-vintage-cream/30 shadow-md group-hover:shadow-2xl transition-shadow duration-500">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out flex justify-center space-x-4 bg-gradient-to-t from-vintage-brown/80 to-transparent">
          <button
            type="button"
            className="w-14 h-14 flex items-center justify-center bg-white/95 backdrop-blur-md text-vintage-brown rounded-full hover:bg-vintage-gold hover:text-white shadow-xl transition-all duration-300 hover:scale-110"
            title="Add to Cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-14 h-14 flex items-center justify-center bg-white/95 backdrop-blur-md text-vintage-brown rounded-full hover:bg-vintage-gold hover:text-white shadow-xl transition-all duration-300 hover:scale-110"
            title="View Details"
          >
            <Eye size={22} strokeWidth={1.5} />
          </Link>
        </div>

        {product.isNew && (
          <span className="absolute top-4 left-4 bg-vintage-gold text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.2em] shadow-md backdrop-blur-sm">
            New
          </span>
        )}
      </div>

      <div className="pt-6 pb-2 flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-serif text-2xl text-vintage-brown mb-2 group-hover:text-vintage-gold transition-colors duration-300 line-clamp-1">
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <div className="text-xs text-vintage-light-brown uppercase tracking-[0.2em] font-sans">
              {product.category}
            </div>
          </div>
          <div className="font-serif text-2xl text-vintage-brown font-medium shrink-0">
            ${product.price ? product.price.toFixed(2) : "0.00"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
