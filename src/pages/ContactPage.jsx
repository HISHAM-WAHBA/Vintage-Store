import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

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

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Your message has been delivered to our curator. We will respond shortly.",
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      <section className="relative overflow-hidden bg-vintage-brown px-5 pb-20 pt-32 sm:px-8 md:pb-24 md:pt-44">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <span className="inline-block py-1.5 px-6 border border-vintage-gold/40 rounded-full font-sans text-xs tracking-[0.3em] uppercase text-vintage-gold">
              Inquiries
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl md:text-7xl text-vintage-cream mb-6 tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="font-sans text-lg text-vintage-cream/80 max-w-2xl mx-auto font-light leading-relaxed mb-4"
          >
            Whether you are searching for a specific historical piece or need
            assistance with your collection, our dedicated curators are here to
            assist you.
          </motion.p>
        </motion.div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 max-w-[90rem] px-5 py-16 sm:-mt-16 sm:px-8 md:py-24 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <motion.div
            className="border-t-4 border-vintage-gold bg-white p-7 shadow-xl sm:p-10 md:p-14 lg:col-span-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-3xl md:text-4xl text-vintage-brown mb-8 relative inline-block"
            >
              Contact Details
              <span className="absolute -bottom-2 left-0 w-1/3 h-[2px] bg-vintage-gold"></span>
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-10 mt-12">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 shrink-0 rounded-full bg-vintage-cream flex items-center justify-center text-vintage-brown group-hover:bg-vintage-brown group-hover:text-vintage-gold transition-colors duration-300">
                  <MapPin size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans text-sm tracking-[0.2em] uppercase text-vintage-light-brown mb-2 font-bold">
                    The Gallery
                  </h3>
                  <p className="font-serif text-lg text-vintage-brown leading-relaxed">
                    1892 Antiquity Lane, <br />
                    Historic District, CA 90210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 shrink-0 rounded-full bg-vintage-cream flex items-center justify-center text-vintage-brown group-hover:bg-vintage-brown group-hover:text-vintage-gold transition-colors duration-300">
                  <Phone size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans text-sm tracking-[0.2em] uppercase text-vintage-light-brown mb-2 font-bold">
                    Telephone
                  </h3>
                  <p className="font-serif text-lg text-vintage-brown tracking-wide">
                    +1 (555) 867-5309
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 shrink-0 rounded-full bg-vintage-cream flex items-center justify-center text-vintage-brown group-hover:bg-vintage-brown group-hover:text-vintage-gold transition-colors duration-300">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans text-sm tracking-[0.2em] uppercase text-vintage-light-brown mb-2 font-bold">
                    Electronic Mail
                  </h3>
                  <p className="font-serif text-lg text-vintage-brown">
                    curator@vintage.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 shrink-0 rounded-full bg-vintage-cream flex items-center justify-center text-vintage-brown group-hover:bg-vintage-brown group-hover:text-vintage-gold transition-colors duration-300">
                  <Clock size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans text-sm tracking-[0.2em] uppercase text-vintage-light-brown mb-2 font-bold">
                    Viewing Hours
                  </h3>
                  <p className="font-serif text-lg text-vintage-brown leading-relaxed">
                    Monday - Friday: 10am - 6pm <br />
                    Saturday: 11am - 4pm <br />
                    <span className="text-sm italic text-vintage-light-brown font-serif mt-1 block">
                      Private viewings available by appointment
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-7 pt-10 lg:pt-0 lg:pl-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-vintage-brown mb-4">
                Send a Missive
              </h2>
              <p className="font-sans text-vintage-light-brown">
                Please fill out the form below and we will respond with due
                haste.
              </p>
            </motion.div>

            <motion.form
              variants={fadeInUp}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-vintage-gold/30 py-4 px-2 text-vintage-brown font-serif text-lg focus:outline-none focus:border-vintage-gold transition-colors duration-300 peer placeholder-transparent"
                    placeholder="Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-2 -top-3.5 text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-vintage-light-brown/60 peer-placeholder-shown:top-4 peer-placeholder-shown:font-serif peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-sans peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-vintage-brown"
                  >
                    Your Name
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-vintage-gold/30 py-4 px-2 text-vintage-brown font-serif text-lg focus:outline-none focus:border-vintage-gold transition-colors duration-300 peer placeholder-transparent"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-2 -top-3.5 text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-vintage-light-brown/60 peer-placeholder-shown:top-4 peer-placeholder-shown:font-serif peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-sans peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-vintage-brown"
                  >
                    Email Address
                  </label>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-vintage-gold/30 py-4 px-2 text-vintage-brown font-serif text-lg focus:outline-none focus:border-vintage-gold transition-colors duration-300 peer placeholder-transparent"
                  placeholder="Subject"
                />
                <label
                  htmlFor="subject"
                  className="absolute left-2 -top-3.5 text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-vintage-light-brown/60 peer-placeholder-shown:top-4 peer-placeholder-shown:font-serif peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-sans peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-vintage-brown"
                >
                  Subject of Inquiry
                </label>
              </div>

              <div className="relative group">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-vintage-gold/30 py-4 px-2 text-vintage-brown font-serif text-lg focus:outline-none focus:border-vintage-gold transition-colors duration-300 peer placeholder-transparent resize-none"
                  placeholder="Message"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-2 -top-3.5 text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-vintage-light-brown/60 peer-placeholder-shown:top-4 peer-placeholder-shown:font-serif peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-sans peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-vintage-brown"
                >
                  Your Message
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative inline-flex items-center gap-4 bg-vintage-brown text-vintage-cream border-2 border-vintage-brown px-12 py-4 font-sans font-medium text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 rounded-sm w-full md:w-auto"
              >
                <span className="absolute inset-0 bg-vintage-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
                <span className="relative z-10 group-hover:text-vintage-brown transition-colors duration-500 flex items-center justify-center gap-3 w-full">
                  {isSubmitting ? "Sending..." : "Dispatch Message"}
                  {!isSubmitting && (
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  )}
                </span>
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
