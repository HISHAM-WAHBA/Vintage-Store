import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-vintage-brown text-vintage-cream mt-auto border-t-8 border-vintage-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-serif text-2xl mb-4 text-vintage-gold">
              Vintage
            </h3>
            <p className="font-sans text-sm leading-relaxed mb-6 opacity-80">
              Curating timeless treasures for the modern soul. Discover unique
              accessories, prints, and decor that tell a story.
            </p>
            <div className="flex space-x-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaPinterest].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-8 h-8 rounded-full border border-vintage-cream flex items-center justify-center hover:bg-vintage-gold hover:border-vintage-gold hover:text-vintage-brown transition-all duration-300"
                  >
                    <Icon size={14} />
                  </a>
                ),
              )}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-vintage-gold uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <Link
                  to="/shop?category=accessories"
                  className="hover:text-vintage-gold transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=prints"
                  className="hover:text-vintage-gold transition-colors"
                >
                  Prints
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=decor"
                  className="hover:text-vintage-gold transition-colors"
                >
                  Home Decor
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=new"
                  className="hover:text-vintage-gold transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-vintage-gold uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-vintage-gold transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-vintage-gold transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-vintage-gold transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-vintage-gold transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-vintage-gold uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="font-sans text-sm mb-4 opacity-80">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border border-vintage-cream px-4 py-2 text-sm focus:outline-none focus:border-vintage-gold placeholder-vintage-cream/50"
              />
              <button className="bg-vintage-gold text-vintage-brown font-bold uppercase tracking-widest text-xs px-4 py-3 hover:bg-vintage-cream transition-colors duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-vintage-cream/20 mt-12 pt-8 text-center font-sans text-xs opacity-60">
          &copy; {new Date().getFullYear()} Vintage Store. All rights reserved.
          Designed with React & Tailwind.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
