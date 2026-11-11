import { db } from "./db.js";
import { hashPassword } from "./auth.js";
import { config } from "./config.js";

const productImage = (file) => `/api/images/products/${file}`;
const categoryImage = (file) => `/api/images/categories/${file}`;

const CATEGORIES = [
  {
    name: "Furniture",
    slug: "furniture",
    description:
      "Restored seating, tables and lighting with real patina — pieces built to outlive trends.",
    image: categoryImage("furniture.jpg"),
  },
  {
    name: "Clothing",
    slug: "clothing",
    description:
      "Hand-picked garments and reworked staples, washed soft and ready to wear.",
    image: categoryImage("clothing.jpg"),
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Leather goods, timepieces and eyewear chosen for craft, not logos.",
    image: categoryImage("accessories.jpg"),
  },
  {
    name: "Decor",
    slug: "decor",
    description:
      "Small objects that finish a room — thrown, dried and poured by hand.",
    image: categoryImage("decor.jpg"),
  },
];

const PRODUCTS = [
  {
    name: "Velvet Chesterfield Sofa",
    category: "furniture",
    price: 899,
    quantity: 2,
    image: productImage("furniture-sofa.jpg"),
    featured: true,
    isNew: true,
    description:
      "A deep-buttoned chesterfield reupholstered in forest-green velvet over a solid beech frame. Restored by hand in our workshop, with hand-tied springs and eight-way support that will carry another fifty years of Sunday afternoons.",
  },
  {
    name: "Leather Club Armchair",
    category: "furniture",
    price: 549,
    quantity: 3,
    image: productImage("furniture-armchair.jpg"),
    featured: true,
    description:
      "A classic club armchair in cognac leather that has already earned its patina. Tufted back, rolled arms and turned walnut feet — it arrives looking like it has always lived in your library.",
  },
  {
    name: "Mid-Century Lounge Chair",
    category: "furniture",
    price: 329,
    quantity: 5,
    image: productImage("furniture-chair2.jpg"),
    description:
      "Scandinavian-inspired silhouette from the mid-century playbook: bentwood frame, boucle upholstery and a pitch that is impossible to sit upright in. Re-webbed and ready for another decade of naps.",
  },
  {
    name: "Brass Pendant Lamp",
    category: "furniture",
    price: 129,
    quantity: 12,
    image: productImage("furniture-lamp.jpg"),
    isNew: true,
    description:
      "Spun-brass pendant with a warm, dimmable glow and a cloth-braided cord. Hung alone or in a cluster over a table, it throws the kind of light that makes everything look like a photograph.",
  },
  {
    name: "70s Floral Tea Dress",
    category: "clothing",
    price: 76,
    quantity: 6,
    image: productImage("clothing-dress2.jpg"),
    description:
      "Featherweight rayon tea dress with a hand-screened 70s floral, keyhole neckline and a skirt that moves on its own. Carefully mended, gently faded, full of stories.",
  },
  {
    name: "Artisan Linen Shirt",
    category: "clothing",
    price: 52,
    quantity: 9,
    image: productImage("clothing-linen.jpg"),
    description:
      "Cut relaxed from garment-washed European linen that only gets softer with every wear. Corozo buttons, single-needle stitching and a collar that sits exactly where it should.",
  },
  {
    name: "Everyday Cotton Tee",
    category: "clothing",
    price: 45,
    quantity: 15,
    image: productImage("clothing-tees.jpg"),
    description:
      "A heavyweight 220gsm tee in organic cotton, tubular-knit so there are no side seams to twist in the wash. The last plain shirt you will have to think about.",
  },
  {
    name: "Retro High-Top Sneakers",
    category: "clothing",
    price: 68,
    quantity: 8,
    image: productImage("clothing-sneakers.jpg"),
    isNew: true,
    description:
      "Vulcanised rubber sole, canvas upper and a court profile lifted straight from a 1970s gymnasium. Broken in for you at the factory, so there is no awkward fortnight.",
  },
  {
    name: "Heritage Gold Watch",
    category: "accessories",
    price: 215,
    quantity: 3,
    image: productImage("accessories-watch-gold.jpg"),
    featured: true,
    description:
      "A 34mm gold-tone case on a hand-stitched leather strap, with a sweep second hand and a face that reads like a promise. Serviced, regulated and keeping honest time.",
  },
  {
    name: "Classic Silver Watch",
    category: "accessories",
    price: 189,
    quantity: 0,
    image: productImage("accessories-watch-silver.jpg"),
    description:
      "A polished silver-tone dress watch slim enough to slip under a cuff. Currently between straps in our workshop — join the waitlist and we will notify you the moment it is back.",
  },
  {
    name: "Round Tortoise Sunglasses",
    category: "accessories",
    price: 58,
    quantity: 10,
    image: productImage("accessories-sunglasses.jpg"),
    isNew: true,
    description:
      "Hand-polished acetate tortoise frames with UV400 lenses and spring hinges. The round keyhole silhouette suits almost every face, which is why it never really left.",
  },
  {
    name: "Over-Ear Studio Headphones",
    category: "accessories",
    price: 99,
    quantity: 7,
    image: productImage("accessories-headphones.jpg"),
    description:
      "Closed-back studio headphones with 40mm drivers, a detachable braided cable and pads soft enough to forget you are wearing them. Tuned flat, the way records were mixed.",
  },
  {
    name: "Leather Weekend Satchel",
    category: "accessories",
    price: 132,
    quantity: 4,
    image: productImage("accessories-bag.jpg"),
    description:
      "Full-grain leather satchel with brass hardware and a lining you will want people to see. Fits a laptop, a weekend of clothes, or one very ambitious market haul.",
  },
  {
    name: "Hand-thrown Ceramic Vase",
    category: "decor",
    price: 42,
    quantity: 14,
    image: productImage("decor-vase.jpg"),
    description:
      "Stoneware vase thrown on the wheel and glazed in soft white, so no two are alike. Water-tight for fresh stems, handsome enough to stand empty.",
  },
  {
    name: "Dried Floral Arrangement",
    category: "decor",
    price: 35,
    quantity: 11,
    image: productImage("decor-flowers.jpg"),
    description:
      "A hand-tied bunch of preserved bunny tails, pampas and dried flax, wrapped in kraft paper. Zero water, zero maintenance, all the calm.",
  },
  {
    name: "Pillar Candle Set",
    category: "decor",
    price: 28,
    quantity: 20,
    image: productImage("decor-candles.jpg"),
    description:
      "Three unscented beeswax pillars in graduated heights, poured by a small studio that still dips by hand. They burn clean for roughly forty slow hours each.",
  },
];

const DISCOUNT_CODES = {
  VINTAGE10: 0.1,
  WELCOME5: 0.05,
};

const seedCategories = () => {
  const insert = db.prepare(
    "INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)",
  );
  for (const category of CATEGORIES) {
    insert.run(category.name, category.slug, category.description, category.image);
  }
  console.log(`[seed] ${CATEGORIES.length} categories inserted`);
};

const seedProducts = () => {
  const insert = db.prepare(`
    INSERT INTO products
      (name, slug, description, price, quantity, image, featured, is_new, category_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const findCategory = db.prepare("SELECT id FROM categories WHERE slug = ?");
  let offset = PRODUCTS.length; // newest first ids for "Newest Arrivals" sort
  for (const product of PRODUCTS) {
    const category = findCategory.get(product.category);
    insert.run(
      product.name,
      product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      product.description,
      product.price,
      product.quantity,
      product.image,
      product.featured ? 1 : 0,
      product.isNew ? 1 : 0,
      category ? category.id : null,
      new Date(Date.now() - offset-- * 36e5).toISOString(),
    );
  }
  console.log(`[seed] ${PRODUCTS.length} products inserted`);
};

const seedAdmin = () => {
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(config.admin.email);
  if (existing) return;
  db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
  ).run(config.admin.name, config.admin.email, hashPassword(config.admin.password));
  console.log(
    `[seed] Admin account created — ${config.admin.email} / ${config.admin.password}`,
  );
};

const seedDiscountCodes = () => {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO discount_codes (code, percent, active) VALUES (?, ?, 1)",
  );
  for (const [code, percent] of Object.entries(DISCOUNT_CODES)) {
    insert.run(code, percent);
  }
};

/** Runs on boot: fills empty tables so the API is useful immediately. */
export const ensureSeed = () => {
  const categoryCount = db
    .prepare("SELECT COUNT(*) AS count FROM categories")
    .get().count;
  if (categoryCount === 0) seedCategories();

  const productCount = db
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get().count;
  if (productCount === 0) seedProducts();

  seedAdmin();
  seedDiscountCodes();
};
