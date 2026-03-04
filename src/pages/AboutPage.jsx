import { motion, useScroll, useTransform } from "framer-motion";
import { Coffee, Award, Shield, Heart } from "lucide-react";

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
    transition: { staggerChildren: 0.2 },
  },
};

const AboutPage = () => {
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="bg-vintage-cream overflow-hidden">
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 px-4 max-w-[90rem] mx-auto overflow-hidden">
        <motion.div
          className="text-center relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <span className="inline-block py-1.5 px-6 border border-vintage-gold/40 rounded-full font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-vintage-brown/80">
              Our Legacy
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-vintage-brown mb-8 leading-tight tracking-tight"
          >
            Preserving History,
            <br className="hidden md:block" />
            <span className="text-vintage-gold italic font-light">
              One Artifact at a Time.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="font-sans text-lg md:text-xl text-vintage-light-brown max-w-2xl mx-auto leading-relaxed font-light"
          >
            We curate exceptional pieces from bygone eras, bringing the elegance
            of the past into the refined spaces of today.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-4 md:px-8 max-w-[100rem] mx-auto mb-32 h-[50vh] md:h-[70vh] relative">
        <div className="w-full h-full overflow-hidden rounded-sm relative">
          <motion.div
            style={{ y: yImage, height: "130%" }}
            className="w-full relative -top-[15%]"
          >
            <img
              src="https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=2000"
              alt="Vintage typewriter and coffee"
              className="w-full h-full object-cover filter brightness-[0.85] sepia-[.15]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-vintage-brown/40 to-transparent"></div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-[90rem] mx-auto bg-white border-y border-vintage-gold/20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="order-2 lg:order-1 relative"
          >
            <motion.div
              variants={fadeInUp}
              className="w-full aspect-[3/4] overflow-hidden rounded-sm shadow-2xl relative"
            >
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=1400"
                alt="Vintage interior"
                className="w-full h-full object-cover filter sepia-[.1]"
              />
              <div className="absolute inset-0 bg-vintage-brown/10 hover:bg-transparent transition-colors duration-500"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -bottom-10 -right-10 bg-vintage-cream p-8 shadow-xl max-w-xs border border-vintage-gold/20 hidden md:block"
            >
              <h4 className="font-serif text-2xl text-vintage-brown mb-2">
                Est. 2024
              </h4>
              <p className="font-sans text-sm text-vintage-light-brown">
                Dedicated to sourcing the finest antiquities.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="order-1 lg:order-2"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl md:text-5xl text-vintage-brown mb-8 relative inline-block"
            >
              The Journey
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-vintage-gold"></span>
            </motion.h2>
            <div className="space-y-6 text-lg text-vintage-light-brown font-sans font-light leading-relaxed">
              <motion.p variants={fadeInUp}>
                What started as a personal collection of rare finds quickly
                blossomed into a pursuit to share historical treasures with
                discerning collectors. We travel the world, searching through
                dusty attics, estate sales, and forgotten boutiques to handpick
                items that posses character, quality, and a story to tell.
              </motion.p>
              <motion.p variants={fadeInUp}>
                Every piece in our collection has survived the test of time,
                bearing the beautiful patina of generations past. We believe
                that incorporating vintage elements into modern life creates a
                profound connection to history and a uniquely authentic
                character that mass-produced items simply cannot match.
              </motion.p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="pt-20 border-t border-vintage-gold/20"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl mt-3 text-vintage-brown mb-4">
              Our Principles
            </h2>
            <p className="font-sans text-vintage-light-brown max-w-xl mx-auto">
              The pillars upon which we build our collection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Authenticity",
                desc: "Every piece is thoroughly inspected and historically verified.",
              },
              {
                icon: Award,
                title: "Quality",
                desc: "We only source items built with enduring craftsmanship.",
              },
              {
                icon: Heart,
                title: "Passion",
                desc: "A deep love for history drives everything we do.",
              },
              {
                icon: Coffee,
                title: "Service",
                desc: "Personalized attention for every esteemed client.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group p-8 border border-vintage-gold/20 hover:border-vintage-gold/60 transition-colors duration-300 bg-vintage-cream/30 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-vintage-brown/5 group-hover:bg-vintage-brown/10 flex items-center justify-center text-vintage-gold mb-6 transition-colors duration-300">
                  <feature.icon strokeWidth={1.5} size={32} />
                </div>
                <h3 className="font-serif text-2xl text-vintage-brown mb-3">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-vintage-light-brown leading-relaxed hidden md:block">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-32 px-4 bg-vintage-brown text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 background-pattern"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <p className="font-serif text-3xl md:text-5xl text-vintage-cream italic leading-normal mb-8 text-vintage-shadow">
            Vintage is not just a style. It's an appreciation for the enduring
            beauty of the past, thoughtfully preserved for the future.
          </p>
          <div className="h-[1px] w-24 bg-vintage-gold mx-auto mb-6"></div>
          <span className="font-sans tracking-[0.3em] uppercase text-xs text-vintage-gold/80">
            The Founder
          </span>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
