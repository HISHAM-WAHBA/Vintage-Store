import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { api } from "../services/api";

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
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await api.getProducts();
      setFeaturedProducts(products.slice(0, 3));
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-vintage-cream overflow-hidden">
      <section className="relative h-[90vh] md:h-[100vh] bg-vintage-brown flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 select-none pointer-events-none"
        >
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-gradient-to-br from-vintage-gold/25 to-transparent blur-3xl mix-blend-screen"
          />
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
            className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-gradient-to-tl from-vintage-gold/15 to-transparent blur-3xl mix-blend-screen"
          />
        </motion.div>

        <motion.div
          style={{ opacity: opacityHero }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold mb-6 pt-24 text-vintage-cream drop-shadow-2xl leading-[1.1] tracking-tight"
          >
            Timeless <br className="hidden md:block" />{" "}
            <span className="text-vintage-gold italic font-light font-serif pr-4">
              Elegance
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="font-sans text-lg md:text-2xl mb-12 max-w-2xl mx-auto text-vintage-cream/80 leading-relaxed font-light"
          >
            Discover a curated collection of classic accessories, art prints,
            and unique treasures that whisper elegant stories of the past.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex justify-center">
            <Link
              to="/shop"
              className="group relative inline-flex items-center gap-4 bg-transparent text-vintage-gold border-2 border-vintage-gold px-10 py-4 font-sans font-medium text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 rounded-sm"
            >
              <span className="absolute inset-0 bg-vintage-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
              <span className="relative z-10 group-hover:text-vintage-brown transition-colors duration-500 flex items-center gap-3">
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto bg-vintage-cream relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col items-center mb-20"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-vintage-brown mb-6 text-center">
            Curated Categories
          </h2>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-vintage-gold to-transparent"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-auto lg:h-[700px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:col-span-7 h-[400px] lg:h-full"
          >
            <Link
              to="/shop?category=accessories"
              className="group relative w-full h-full block overflow-hidden rounded-sm shadow-xl"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=1400"
                alt="Accessories"
                className="w-full h-full object-cover filter brightness-[0.8] sepia-[.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vintage-brown/90 via-vintage-brown/20 to-transparent flex flex-col justify-end p-10 lg:p-14">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <p className="text-vintage-gold text-xs font-sans tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
                    <span className="h-[1px] w-8 bg-vintage-gold inline-block"></span>{" "}
                    Featured
                  </p>
                  <h3 className="font-serif text-5xl lg:text-7xl text-white mb-2 group-hover:text-vintage-gold transition-colors duration-500">
                    Accessories
                  </h3>
                  <span className="inline-flex mt-4 items-center gap-2 text-white/80 text-sm font-sans tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </div>
            </Link>
          </motion.div>

          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 h-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex-1 h-[300px] lg:h-1/2"
            >
              <Link
                to="/shop?category=prints"
                className="group relative w-full h-full block overflow-hidden rounded-sm shadow-xl"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src="https://images.unsplash.com/photo-1581447109200-bf2769116351?auto=format&fit=crop&q=80&w=1000"
                  alt="Prints"
                  className="w-full h-full object-cover filter brightness-[0.85] sepia-[.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vintage-brown/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="font-serif text-3xl lg:text-4xl text-white group-hover:text-vintage-gold transition-colors duration-500">
                    Fine Prints
                  </h3>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex-1 h-[300px] lg:h-1/2"
            >
              <Link
                to="/shop?category=home decor"
                className="group relative w-full h-full block overflow-hidden rounded-sm shadow-xl"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000"
                  alt="Home Decor"
                  className="w-full h-full object-cover filter brightness-[0.85] sepia-[.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vintage-brown/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="font-serif text-3xl lg:text-4xl text-white group-hover:text-vintage-gold transition-colors duration-500">
                    Home Decor
                  </h3>
                </div>
              </Link>
            </motion.div>
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
                <div className="relative overflow-hidden aspect-[4/5] mb-8 bg-vintage-cream/30 shadow-lg rounded-sm cursor-pointer">
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
    </div>
  );
};

export default HomePage;
