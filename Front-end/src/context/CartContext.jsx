import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

/* Demo discount codes (percent off) */
const DISCOUNT_CODES = {
  VINTAGE10: 0.1,
  WELCOME5: 0.05,
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("vintage_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [discount, setDiscount] = useState(() => {
    try {
      const saved = localStorage.getItem("vintage_discount");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("vintage_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (discount) {
      localStorage.setItem("vintage_discount", JSON.stringify(discount));
    } else {
      localStorage.removeItem("vintage_discount");
    }
  }, [discount]);

  const applyDiscountCode = (code) => {
    const normalized = code.trim().toUpperCase();
    const percent = DISCOUNT_CODES[normalized];
    if (!percent) {
      toast.error("That code didn't work — try VINTAGE10");
      return false;
    }
    setDiscount({ code: normalized, percent });
    toast.success(`Code ${normalized} applied — ${percent * 100}% off your order`);
    return true;
  };

  const removeDiscount = () => setDiscount(null);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);
    setCart((prevCart) => {
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    toast.success(
      existingItem
        ? `Updated quantity for ${product.name}`
        : `Added ${product.name} to cart`,
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(null);
    toast.success("Cart cleared");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        discount,
        applyDiscountCode,
        removeDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
