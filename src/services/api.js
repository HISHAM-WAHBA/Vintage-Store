const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Antique Brass Telescope",
    price: 129.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=800",
    description:
      "A beautifully crafted brass telescope, perfect for decorative display or a thoughtful gift.",
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
    description:
      "Hand-stitched leather journal with refillable paper for daily writing.",
  },
  {
    id: 4,
    name: "Botanical Illustration Set",
    price: 55.0,
    category: "Prints",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
    description: "Set of 3 botanical prints featuring rare ferns and flowers.",
  },
  {
    id: 5,
    name: "Classic Pocket Watch",
    price: 89.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=800",
    description:
      "Functional mechanical pocket watch with gold plating and timeless appeal.",
  },
  {
    id: 6,
    name: "Victorian Brass Lamp",
    price: 109.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800",
    description:
      "A refined brass lamp with a vintage silhouette and warm ambient glow.",
  },
  {
    id: 7,
    name: "Art Deco Serving Tray",
    price: 74.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800",
    description:
      "Elegant serving tray with geometric lines inspired by the Art Deco era.",
  },
  {
    id: 8,
    name: "Old World Tea Set",
    price: 96.5,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description: "A charming tea set with a nostalgic old-world finish.",
  },
  {
    id: 9,
    name: "Retro Camera Stand",
    price: 62.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    description:
      "Decorative camera stand with a classic 1950s-inspired design.",
  },
  {
    id: 10,
    name: "Antique Inkwell",
    price: 42.75,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    description: "A beautifully aged inkwell perfect for a refined desk setup.",
  },
  {
    id: 11,
    name: "Garden Sundial",
    price: 58.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
    description: "Outdoor garden sundial made for a timeless decorative touch.",
  },
  {
    id: 12,
    name: "Royal Blue Vase",
    price: 68.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
    description: "A striking blue ceramic vase with subtle enamel detailing.",
  },
  {
    id: 13,
    name: "Luggage Tag Set",
    price: 29.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    description: "A set of travel-inspired luggage tags with vintage charm.",
  },
  {
    id: 14,
    name: "French Poster Frame",
    price: 51.0,
    category: "Prints",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    description:
      "Framed vintage-inspired poster featuring a romantic French motif.",
  },
  {
    id: 15,
    name: "Leather Desk Clock",
    price: 79.99,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    description: "Classic desk clock with leather accents and antique styling.",
  },
  {
    id: 16,
    name: "Handcrafted Candle Tin",
    price: 24.5,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1602872029707-0c5f52b0f5d5?auto=format&fit=crop&q=80&w=800",
    description:
      "A nostalgic candle tin with warm fragrance and elegant packaging.",
  },
  {
    id: 17,
    name: "Porcelain Trinket Dish",
    price: 32.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
    description:
      "Delicate porcelain dish ideal for jewelry storage or bedside accents.",
  },
  {
    id: 18,
    name: "Framed Botanical Sketch",
    price: 48.0,
    category: "Prints",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
    description:
      "A framed botanical sketch that brings an heirloom feel to any wall.",
  },
  {
    id: 19,
    name: "Brass Bookmark",
    price: 18.5,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    description: "A slim brass bookmark made for literary gifts and keepsakes.",
  },
  {
    id: 20,
    name: "Vintage Postcard Pack",
    price: 22.0,
    category: "Prints",
    image:
      "https://images.unsplash.com/photo-1516979187454-437ec3d0f55b?auto=format&fit=crop&q=80&w=800",
    description:
      "A collectible pack of vintage-style postcards for gifting or framing.",
  },
  {
    id: 21,
    name: "Linen Table Runner",
    price: 64.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800",
    description:
      "Soft linen runner for dining tables with a classic vintage finish.",
  },
  {
    id: 22,
    name: "Mini Globe Decor",
    price: 44.99,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&q=80&w=800",
    description:
      "Small globe ornament inspired by antique cartography and travel lore.",
  },
  {
    id: 23,
    name: "Elegant Ribbon Box",
    price: 27.0,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
    description:
      "A gift-ready ribbon box with elegant finishes for special occasions.",
  },
  {
    id: 24,
    name: "Silver Photo Frame",
    price: 39.5,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    description:
      "Classic silver frame designed to elevate portraits and keepsakes.",
  },
  {
    id: 25,
    name: "Seed Packet Collection",
    price: 30.0,
    category: "Prints",
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c5?auto=format&fit=crop&q=80&w=800",
    description:
      "A curated packet collection with illustrated garden-inspired designs.",
  },
  {
    id: 26,
    name: "Hand-Stitched Coaster Set",
    price: 34.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800",
    description:
      "A coordinated coaster set stitched in a timeless, heirloom style.",
  },
  {
    id: 27,
    name: "Glass Apothecary Jar",
    price: 41.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800",
    description:
      "Vintage-inspired storage jar that fits beautifully into styled shelves.",
  },
  {
    id: 28,
    name: "Retro Puzzle Book",
    price: 19.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1516979187454-437ec3d0f55b?auto=format&fit=crop&q=80&w=800",
    description:
      "A charming puzzle book with retro artwork for quiet afternoons.",
  },
  {
    id: 29,
    name: "Personalized Monogram Card",
    price: 16.0,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    description:
      "A custom monogram card that makes a lovely gift finishing touch.",
  },
  {
    id: 30,
    name: "Antique Key Holder",
    price: 53.0,
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    description:
      "A decorative key holder with antique detailing and practical charm.",
  },
];

const MOCK_CATEGORIES = [
  { id: "back-to-school", name: "Back to School" },
  { id: "birthday-giveaways", name: "Birthday Giveaways" },
  { id: "baby-giveaways", name: "Baby Giveaways" },
  { id: "bridal-giveaways", name: "Bridal Giveaways" },
  { id: "photo-prints", name: "Photo Prints" },
  { id: "party-supplies", name: "Party Supplies" },
  { id: "gift-box", name: "Create your Gift Box" },
  { id: "custom-gifts", name: "Custom Gifts" },
  { id: "outlet", name: "Outlet" },
  { id: "stickers", name: "Stickers" },
  { id: "mugs-bottles", name: "Mugs & Bottles" },
  { id: "mask-hat-crown", name: "Mask, Hat & Crown" },
  { id: "mystery-box", name: "Mystery Box" },
];

const PRODUCT_CATEGORY_IDS = [
  "back-to-school",
  "birthday-giveaways",
  "baby-giveaways",
  "bridal-giveaways",
  "photo-prints",
  "party-supplies",
  "gift-box",
  "custom-gifts",
  "outlet",
  "stickers",
  "mugs-bottles",
  "mask-hat-crown",
  "mystery-box",
  "back-to-school",
  "birthday-giveaways",
  "baby-giveaways",
  "bridal-giveaways",
  "photo-prints",
  "party-supplies",
  "gift-box",
  "custom-gifts",
  "outlet",
  "stickers",
  "mugs-bottles",
  "mask-hat-crown",
  "mystery-box",
  "back-to-school",
  "birthday-giveaways",
  "custom-gifts",
  "gift-box",
];

const getCatalogProducts = () =>
  MOCK_PRODUCTS.map((product, index) => {
    const category = MOCK_CATEGORIES.find(
      (item) => item.id === PRODUCT_CATEGORY_IDS[index],
    );

    return { ...product, category: category.name };
  });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const PRODUCTS_STORAGE_KEY = "vintage_admin_products";
const CATEGORIES_STORAGE_KEY = "vintage_admin_categories";

const readStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const getStoredProducts = () =>
  readStorage(PRODUCTS_STORAGE_KEY, getCatalogProducts());

const getStoredCategories = () =>
  readStorage(CATEGORIES_STORAGE_KEY, MOCK_CATEGORIES);

export const api = {
  getProducts: async () => {
    await delay(500);
    return getStoredProducts();
  },

  getProductById: async (id) => {
    await delay(300);
    return getStoredProducts().find((p) => p.id === parseInt(id));
  },

  getProductsByCategory: async (category) => {
    await delay(400);
    const categories = getStoredCategories();
    const products = getStoredProducts();
    if (category.toLowerCase() === "all") return products;

    const selectedCategory = categories.find(
      (item) =>
        item.id.toLowerCase() === category.toLowerCase() ||
        item.name.toLowerCase() === category.toLowerCase(),
    );

    if (!selectedCategory) return [];

    return products.filter(
      (product) => product.category === selectedCategory.name,
    );
  },

  getCategories: async () => {
    await delay(300);
    return getStoredCategories();
  },

  saveProducts: async (products) => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return products;
  },

  saveCategories: async (categories) => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    return categories;
  },
};
