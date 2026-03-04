import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-vintage-cream px-4">
        <h2 className="font-serif text-3xl text-vintage-brown mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-vintage-light-brown mb-8 font-sans">
          Looks like you haven't added any treasures yet.
        </p>
        <Link
          to="/shop"
          className="bg-vintage-gold text-vintage-brown font-bold uppercase tracking-widest px-8 py-3 hover:bg-vintage-brown hover:text-vintage-gold transition-colors duration-300 shadow-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-vintage-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl text-vintage-brown mb-8 text-center">
          Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 bg-white shadow-sm border border-transparent hover:border-vintage-gold/30 transition-colors"
                >
                  <div className="w-24 h-32 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl text-vintage-brown">
                          <Link
                            to={`/product/${item.id}`}
                            className="hover:text-vintage-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-vintage-light-brown hover:text-red-600 transition-colors p-1"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="text-sm text-vintage-gold font-bold uppercase tracking-wider mt-1">
                        {item.category}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-vintage-brown/30 rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-vintage-brown hover:text-vintage-cream transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-sans text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-vintage-brown hover:text-vintage-cream transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-sans font-bold text-lg text-vintage-brown">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Link
                to="/shop"
                className="flex items-center text-vintage-light-brown hover:text-vintage-gold transition-colors font-sans font-bold"
              >
                <FiArrowLeft className="mr-2" /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-sans text-sm underline"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white p-8 shadow-md border-t-4 border-vintage-gold sticky top-28">
              <h3 className="font-serif text-2xl text-vintage-brown mb-6 pb-4 border-b border-vintage-cream">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 text-vintage-text font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-vintage-cream pt-4 mb-8">
                <div className="flex justify-between font-bold text-xl text-vintage-brown">
                  <span>Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-vintage-brown text-vintage-cream py-4 uppercase tracking-widest font-bold hover:bg-vintage-gold transition-colors duration-300 shadow-lg">
                Proceed to Checkout
              </button>

              <p className="text-center text-xs mt-4 text-vintage-light-brown">
                Secure Checkout powered by MockPay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
