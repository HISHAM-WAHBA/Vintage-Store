import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import VintageLogo from "./VintageLogo";
import Icon from "./Icon";
import { api } from "../services/api";

const FOOTER_LINKS = {
  explore: [
    { label: "Shop", to: "/shop" },
    { label: "Categories", to: "/shop" },
    { label: "Customized", to: "/info/custom-orders" },
    { label: "Our Story", to: "/about" },
  ],
  support: [
    { label: "Contact Us", to: "/contact" },
    { label: "Shipping & Returns", to: "/info/shipping-returns" },
    { label: "FAQ", to: "/info/faq" },
    { label: "Privacy Policy", to: "/info/privacy-policy" },
    { label: "Custom Orders", to: "/info/custom-orders" },
  ],
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (isSubscribing) return;
    setIsSubscribing(true);
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail("");
      toast.success("You're on the list — welcome to the studio.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="mt-auto w-full border-t border-outline-variant bg-surface-container-low py-stack-lg">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter px-margin-mobile md:grid-cols-4 md:px-margin-desktop">
        {/* Brand column */}
        <div className="mb-8 md:mb-0">
          <VintageLogo className="mb-4 h-10 w-auto" />
          <p className="mb-4 font-body-md text-body-md text-on-surface-variant">
            Crafting nostalgic, bespoke experiences for the modern creative
            soul.
          </p>
          <div className="flex gap-4 text-primary">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary-container"
              aria-label="Instagram"
            >
              <Icon name="photo_camera" />
            </a>
            <a
              href="mailto:hello@vintage.com"
              className="transition-colors hover:text-primary-container"
              aria-label="Email"
            >
              <Icon name="mail" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="mb-4 font-label-md text-label-md uppercase tracking-widest text-on-background">
            Explore
          </h4>
          <ul className="flex flex-col gap-3">
            {FOOTER_LINKS.explore.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="font-body-md text-body-md text-on-surface-variant underline transition-all hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-4 font-label-md text-label-md uppercase tracking-widest text-on-background">
            Support
          </h4>
          <ul className="flex flex-col gap-3">
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="font-body-md text-body-md text-on-surface-variant underline transition-all hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-4 font-label-md text-label-md uppercase tracking-widest text-on-background">
            Newsletter
          </h4>
          <p className="mb-4 font-body-md text-body-md text-on-surface-variant">
            Join our studio for updates and exclusive artisanal drops.
          </p>

          {subscribed ? (
            <div className="rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-3 font-body-md text-sm text-tertiary">
              Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                className="w-full min-w-0 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body-md text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-tertiary focus:ring-1 focus:ring-tertiary"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="shrink-0 rounded-lg bg-primary px-4 py-2 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
              >
                {isSubscribing ? "…" : "Subscribe"}
              </button>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="col-span-1 mt-stack-md border-t border-outline-variant/30 pt-stack-md text-center md:col-span-4">
          <p className="font-body-md text-body-md text-sm text-on-surface-variant">
            © {new Date().getFullYear()} Vintage Artisanal Studio. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
