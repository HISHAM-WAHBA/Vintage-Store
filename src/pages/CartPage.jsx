import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-vintage-cream px-5 text-center">
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
    <div className="min-h-screen bg-vintage-cream px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-center font-serif text-4xl text-vintage-brown sm:text-5xl">
          Your Cart
        </h1>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <div className="flex-1">
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border border-vintage-brown/10 bg-white p-4 transition-colors hover:border-vintage-gold/40 sm:gap-6 sm:p-6"
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
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-lg text-vintage-brown sm:text-xl">
                          <Link
                            to={`/product/${item.id}`}
                            className="hover:text-vintage-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1 text-vintage-light-brown transition-colors hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="text-sm text-vintage-gold font-bold uppercase tracking-wider mt-1">
                        {item.category}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-vintage-brown/30">
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
            <div className="sticky top-28 border-t-4 border-vintage-gold bg-white p-6 shadow-sm sm:p-8">
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

              <Link
                to="/checkout"
                className="block w-full bg-vintage-brown py-4 text-center font-sans font-bold uppercase tracking-widest text-vintage-cream transition-colors duration-300 hover:bg-vintage-gold"
              >
                Proceed to Checkout
              </Link>

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
