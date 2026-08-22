import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { api } from "../services/api";

const heroSlides = [
  {
    eyebrow: "New arrivals",
    title: "Find your story.",
    description:
      "Curated accessories, art prints, and little treasures for spaces and people with a point of view.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=85&w=2200",
    alt: "Curated vintage accessories",
  },
  {
    eyebrow: "The print edit",
    title: "Walls with a past.",
    description:
      "Bring character home with artwork and paper goods chosen to live beautifully for years.",
    image:
      "https://images.unsplash.com/photo-1581447109200-bf2769116351?auto=format&fit=crop&q=85&w=2200",
    alt: "Vintage-inspired art prints",
  },
  {
    eyebrow: "Thoughtful gifts",
    title: "Give them a keepsake.",
    description:
      "Small objects, lasting impressions, and gift-ready finds for the people who notice the details.",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=85&w=2200",
    alt: "A vintage keepsake ready for gifting",
  },
];

const categoryCards = [
  {
    name: "Back to School",
    slug: "back-to-school",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Birthday Giveaways",
    slug: "birthday-giveaways",
    image:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Baby Giveaways",
    slug: "baby-giveaways",
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Bridal Giveaways",
    slug: "bridal-giveaways",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Photo Prints",
    slug: "photo-prints",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Party Supplies",
    slug: "party-supplies",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Create your Gift Box",
    slug: "gift-box",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Custom Gifts",
    slug: "custom-gifts",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Outlet",
    slug: "outlet",
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Stickers",
    slug: "stickers",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Mugs & Bottles",
    slug: "mugs-bottles",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Mask, Hat & Crown",
    slug: "mask-hat-crown",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=85&w=900",
  },
  {
    name: "Mystery Box",
    slug: "mystery-box",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=85&w=900",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  const showSlide = (index) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const rotateSlides = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 6000);

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") showSlide(activeSlide + 1);
      if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearInterval(rotateSlides);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlide]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await api.getProducts();
      setFeaturedProducts(products.slice(0, 3));
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-vintage-cream overflow-hidden">
      <section className="relative flex min-h-[calc(100svh-4.75rem)] items-end overflow-hidden bg-vintage-brown sm:min-h-[calc(100svh-5.5rem)] lg:min-h-[min(54rem,calc(100svh-7.25rem))]">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroSlides[activeSlide].image}
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={heroSlides[activeSlide].image}
            alt={heroSlides[activeSlide].alt}
            className="absolute inset-0 h-[115%] w-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-vintage-brown/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-vintage-brown/95 via-vintage-brown/20 to-transparent" />

        <motion.div
          key={heroSlides[activeSlide].title}
          style={{ opacity: opacityHero }}
          className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col justify-end px-5 pb-12 pt-32 text-left sm:px-8 sm:pb-16 md:pb-20 lg:px-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-vintage-gold"
          >
            <span className="h-px w-10 bg-vintage-gold" />
            {heroSlides[activeSlide].eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="max-w-4xl font-serif text-5xl font-medium leading-[0.95] tracking-tight text-vintage-cream drop-shadow-2xl sm:text-8xl lg:text-[9rem]"
          >
            {heroSlides[activeSlide].title}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mb-9 mt-6 max-w-xl font-sans text-base leading-relaxed text-vintage-cream/85 md:text-lg"
          >
            {heroSlides[activeSlide].description}
          </motion.p>
        </motion.div>

        <div className="absolute bottom-6 right-5 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8 lg:right-12">
          <button
            type="button"
            onClick={() => showSlide(activeSlide - 1)}
            aria-label="Previous offer"
            className="flex h-10 w-10 items-center justify-center border border-vintage-cream/50 text-vintage-cream transition-colors hover:border-vintage-gold hover:bg-vintage-gold hover:text-vintage-brown"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => showSlide(activeSlide + 1)}
            aria-label="Next offer"
            className="flex h-10 w-10 items-center justify-center border border-vintage-cream/50 text-vintage-cream transition-colors hover:border-vintage-gold hover:bg-vintage-gold hover:text-vintage-brown"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div
            className="ml-2 flex items-center gap-2"
            aria-label="Offer slides"
          >
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => showSlide(index)}
                aria-label={`Show offer ${index + 1}`}
                className={`h-1.5 transition-all ${
                  index === activeSlide
                    ? "w-8 bg-vintage-gold"
                    : "w-1.5 bg-vintage-cream/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-vintage-brown/10 bg-vintage-cream px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-3 text-center font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-vintage-light-brown sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-vintage-brown/15 sm:text-[11px] sm:tracking-[0.2em]">
          <span>Curated pieces, always changing</span>
          <span>Gift-ready packaging</span>
          <span>Clear delivery updates</span>
        </div>
      </section>

      <section className="relative mx-auto max-w-[90rem] bg-vintage-cream px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mb-12 flex flex-col items-center sm:mb-16"
        >
          <h2 className="mb-4 text-center font-serif text-4xl text-vintage-brown md:text-6xl">
            Our Categories
          </h2>
          <p className="max-w-xl text-center font-sans text-sm leading-relaxed text-vintage-light-brown sm:text-base">
            Browse thoughtful gifts, playful party details, and printed pieces
            made for every kind of celebration.
          </p>
          <div className="mt-6 h-0.5 w-20 bg-vintage-gold"></div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-5">
          {categoryCards.map((category, index) => (
            <motion.div
              key={category.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              transition={{ delay: (index % 5) * 0.06 }}
              className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <Link
                to={`/shop?category=${category.slug}`}
                className={`group relative block overflow-hidden border border-vintage-brown/10 bg-white ${
                  index === 0 ? "aspect-[2/1] sm:aspect-[2/1]" : "aspect-square"
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover brightness-[0.84] saturate-[0.85] transition duration-700 group-hover:scale-105 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vintage-brown/85 via-vintage-brown/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  {category.badge && (
                    <span className="mb-2 inline-block bg-vintage-gold px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-vintage-brown">
                      {category.badge}
                    </span>
                  )}
                  <h3 className="font-serif text-lg leading-tight text-white transition-colors group-hover:text-vintage-gold sm:text-xl">
                    {category.name}
                  </h3>
                  <span className="mt-2 hidden items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 sm:inline-flex">
                    Explore{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-vintage-gold">
        <div className="mx-auto grid min-h-[25rem] max-w-[90rem] lg:grid-cols-2">
          <div className="relative min-h-[18rem] overflow-hidden lg:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=85&w=1400"
              alt="A close look at a vintage keepsake"
              className="h-full w-full object-cover object-center grayscale-[.1] transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 text-vintage-brown sm:px-12 lg:px-20">
            <p className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.28em]">
              The little things matter
            </p>
            <h2 className="max-w-lg font-serif text-4xl leading-none sm:text-6xl">
              Make room for something memorable.
            </h2>
            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-vintage-brown/75">
              From desk-side treasures to art for empty walls, find pieces that
              make ordinary corners feel like your own.
            </p>
            <Link
              to="/shop"
              className="group mt-8 inline-flex w-fit items-center gap-3 border-b border-vintage-brown pb-2 font-sans text-xs font-bold uppercase tracking-[0.2em]"
            >
              Shop the edit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-32 px-4 sm:px-6 lg:px-8 border-t border-vintage-gold/10 relative z-10">
        <div className="max-w-[90rem] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-vintage-gold/20 pb-8"
          >
            <motion.div variants={fadeInUp} className="max-w-xl">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-vintage-brown mb-4">
                New Arrivals
              </h2>
              <p className="text-vintage-light-brown font-sans text-lg md:text-xl font-light">
                Carefully selected pieces from our most recent curation.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 text-vintage-brown font-sans text-sm tracking-[0.2em] font-bold uppercase hover:text-vintage-gold transition-colors"
              >
                <span>View Entire Shop</span>
                <span className="p-3 rounded-full border border-vintage-brown/20 group-hover:border-vintage-gold transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                className="group flex flex-col"
              >
                <div className="relative mb-8 aspect-[4/5] cursor-pointer overflow-hidden border border-vintage-brown/10 bg-vintage-cream/30">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex justify-center z-10">
                    <button className="w-full backdrop-blur-md bg-white/80 border border-white/50 text-vintage-brown py-4 px-6 flex items-center justify-center gap-3 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-vintage-brown hover:text-vintage-gold hover:border-vintage-brown transition-all duration-300 font-sans tracking-widest text-xs uppercase font-bold">
                      <ShoppingBag className="w-4 h-4" />
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-serif text-2xl text-vintage-brown group-hover:text-vintage-gold transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-vintage-brown font-serif text-2xl shrink-0">
                      ${product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown">
                      {product.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-t border-vintage-brown/10 bg-vintage-cream px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-vintage-brown/15">
          {[
            {
              title: "Curated slowly",
              text: "Thoughtful objects chosen for character, not clutter.",
            },
            {
              title: "Gift-ready",
              text: "Beautiful finds, packed with care for someone special.",
            },
            {
              title: "Delivered simply",
              text: "Clear shipping updates from our door to yours.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="px-0 md:px-10 first:md:pl-0 last:md:pr-0"
            >
              <h3 className="font-serif text-2xl text-vintage-brown">
                {item.title}
              </h3>
              <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-vintage-light-brown">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
