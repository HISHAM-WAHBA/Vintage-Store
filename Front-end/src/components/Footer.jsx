import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Mail, Send } from "lucide-react";
import VintageLogo from "./VintageLogo";

const FOOTER_LINKS = {
  explore: [
    { label: "Shop", to: "/shop" },
    { label: "Our Story", to: "/about" },
    { label: "Custom Orders", to: "/shop" },
    { label: "Corporate Gifting", to: "/contact" },
    { label: "Journal", to: "/" },
  ],
  support: [
    { label: "Contact Us", to: "/contact" },
    { label: "Shipping & Returns", to: "/contact" },
    { label: "FAQ", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

const Footer = () => {
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  // Hide footer bottom nav area on mobile home (uses full-bleed hero)
  const hiddenOnMobileHome = pathname === "/";

  return (
    <footer
      className={`mt-auto w-full border-t border-vintage-border/50 bg-vintage-pink ${
        hiddenOnMobileHome ? "hidden lg:block" : ""
      }`}
    >
      {/* Main grid */}
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 pb-10 pt-14 sm:px-12 lg:grid-cols-4 lg:px-12">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <VintageLogo className="mb-4 w-16" />
          <p className="max-w-56 text-sm leading-6 text-vintage-light-brown">
            Curating joy through artisanal, thoughtful gifting experiences for every meaningful moment.
          </p>
          {/* Social icons */}
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-vintage-cream text-vintage-light-brown transition-all duration-200 hover:bg-vintage-gold hover:text-white hover:scale-110 active:scale-95"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@vintage.com"
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-vintage-cream text-vintage-light-brown transition-all duration-200 hover:bg-vintage-gold hover:text-white hover:scale-110 active:scale-95"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-vintage-brown">
            Explore
          </h3>
          <ul className="flex flex-col gap-2.5">
            {FOOTER_LINKS.explore.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm text-vintage-light-brown transition hover:text-vintage-gold hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-vintage-brown">
            Support
          </h3>
          <ul className="flex flex-col gap-2.5">
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm text-vintage-light-brown transition hover:text-vintage-gold hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-vintage-brown">
            Join the Studio
          </h3>
          <p className="mb-4 text-sm leading-5 text-vintage-light-brown">
            Get 10% off your first custom box and exclusive artisanal updates.
          </p>

          {subscribed ? (
            <div className="rounded-xl border border-vintage-border bg-white px-4 py-3 text-sm font-medium text-vintage-accent">
              ✓ Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-xl border border-vintage-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-vintage-accent focus:ring-2 focus:ring-vintage-accent/20"
              />
              <button
                type="submit"
                className="btn-vintage-primary flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-vintage-border/30 px-6 py-4 sm:px-12">
        <p className="text-center text-xs text-vintage-light-brown">
          © {new Date().getFullYear()} Vintage Artisanal Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
