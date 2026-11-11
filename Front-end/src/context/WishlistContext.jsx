import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

const STORAGE_KEY = "vintage_wishlist";

/**
 * Product wishlist persisted to localStorage — works for guests and
 * signed-in customers alike (same pattern as the cart).
 */
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  const toggleWishlist = (product) => {
    let added = false;
    setWishlist((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id);
      }
      added = true;
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          categories: product.categories || [],
          quantity: product.quantity,
        },
      ];
    });
    if (added) {
      toast.success(`${product.name} added to wishlist`);
    } else {
      toast.success(`${product.name} removed from wishlist`);
    }
    return added;
  };

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId));
    toast.success("Removed from wishlist");
  };

  const getWishlistCount = () => wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
