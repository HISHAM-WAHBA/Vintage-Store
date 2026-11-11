import { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api, getStoredToken } from "../services/api";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

const STORAGE_KEY = "vintage_wishlist";

const readLocal = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

/**
 * Wishlist: localStorage for guests, server-synced for signed-in customers.
 * On first authenticated load we merge local items into the server list so
 * nothing the guest saved before signing in is lost.
 */
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(readLocal);
  const syncedRef = useRef(false);
  const syncIdRef = useRef(0);

  // Persist guest/local state always (handy fallback).
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync with server when authenticated (on mount and after login/logout).
  useEffect(() => {
    const sync = async () => {
      const token = getStoredToken();
      if (!token) {
        syncedRef.current = false;
        return;
      }
      if (syncedRef.current) return;
      const currentSyncId = ++syncIdRef.current;
      try {
        const localIds = readLocal().map((p) => p.id).filter(Boolean);
        if (localIds.length) await api.syncWishlist(localIds);
        const server = await api.getWishlist();
        if (currentSyncId !== syncIdRef.current || !getStoredToken()) return;
        setWishlist(server);
        syncedRef.current = true;
      } catch {
        // stay on local (401 is handled globally by the API client)
      }
    };

    sync();

    const onAuth = () => {
      syncedRef.current = false;
      syncIdRef.current += 1; // invalidate any in-flight sync
      const token = getStoredToken();
      if (!token) {
        setWishlist([]);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        } catch {
          // ignore
        }
        return;
      }
      sync();
    };

    window.addEventListener("vintage-auth-changed", onAuth);
    return () => {
      syncIdRef.current += 1;
      window.removeEventListener("vintage-auth-changed", onAuth);
    };
  }, []);

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  const toggleWishlist = (product) => {
    const token = getStoredToken();
    const currentlyIn = wishlist.some((item) => item.id === product.id);

    if (token) {
      // optimistic UI
      setWishlist((current) =>
        currentlyIn
          ? current.filter((item) => item.id !== product.id)
          : [
              ...current,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                categories: product.categories || [],
                quantity: product.quantity,
              },
            ],
      );
      api
        .toggleWishlist(product.id)
        .then((res) => {
          if (res?.wishlist) setWishlist(res.wishlist);
        })
        .catch(() => {
          // revert on failure
          setWishlist((current) =>
            currentlyIn
              ? [
                  ...current,
                  {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    categories: product.categories || [],
                    quantity: product.quantity,
                  },
                ]
              : current.filter((item) => item.id !== product.id),
          );
          toast.error("Could not update wishlist.");
          return;
        });
      toast.success(
        currentlyIn
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`,
      );
      return !currentlyIn;
    }

    // Guest/local
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
    toast.success(
      added
        ? `${product.name} added to wishlist`
        : `${product.name} removed from wishlist`,
    );
    return added;
  };

  const removeFromWishlist = (productId) => {
    const token = getStoredToken();
    setWishlist((current) => current.filter((item) => item.id !== productId));
    if (token) {
      api.removeWishlistItem(productId).catch(() => {});
    }
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
