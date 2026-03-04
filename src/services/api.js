/**
 * Mock API Service
 *
 * Simulates backend calls for the Vintage E-commerce store.
 * Replace these promises with actual fetch/axios calls when backend is ready.
 */

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Antique Brass Telescope",
    price: 129.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=800",
    description:
      "A beautifully crafted brass telescope, perfect for navigation or decoration.",
  },
  {
    id: 2,
    name: "Vintage World Map Print",
    price: 45.0,
    category: "Prints",
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
    description:
      "Detailed reproduction of a 17th-century world map on high-quality parchment paper.",
  },
  {
    id: 3,
    name: "Leather Bound Journal",
    price: 35.5,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    description: "Hand-stitched leather journal with refillable paper.",
  },
  {
    id: 4,
    name: "Botanical Illustration Set",
    price: 55.0,
    category: "Prints",
    image:
      "https://images.unsplash.com/photo-1518175653494-b7782635928d?auto=format&fit=crop&q=80&w=800",
    description: "Set of 3 botanical prints featuring rare ferns and flowers.",
  },
  {
    id: 5,
    name: "Classic Pocket Watch",
    price: 89.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=800",
    description: "Functional mechanical pocket watch with gold plating.",
  },
];

const MOCK_CATEGORIES = [
  { id: "all", name: "All Treasures" },
  { id: "accessories", name: "Accessories" },
  { id: "prints", name: "Prints" },
  { id: "decor", name: "Home Decor" },
];

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getProducts: async () => {
    await delay(500);
    return MOCK_PRODUCTS;
  },

  getProductById: async (id) => {
    await delay(300);
    return MOCK_PRODUCTS.find((p) => p.id === parseInt(id));
  },

  getProductsByCategory: async (category) => {
    await delay(400);
    if (category.toLowerCase() === "all") return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  },

  getCategories: async () => {
    await delay(300);
    return MOCK_CATEGORIES;
  },
};
