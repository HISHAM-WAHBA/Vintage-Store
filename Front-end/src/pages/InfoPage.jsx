import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";

/* Content for the storefront's informational pages. */
const PAGES = {
  faq: {
    eyebrow: "Answers",
    title: "Frequently Asked Questions",
    intro:
      "Everything customers usually ask before their first order. Still curious? Send us a message.",
    sections: [
      {
        heading: "Orders & payment",
        items: [
          {
            q: "How do I place an order?",
            a: "Add pieces to your cart from the shop, apply a discount code if you have one, and check out with either cash on delivery or card payment.",
          },
          {
            q: "Can I change or cancel my order?",
            a: "Reach out within a few hours of ordering and we can usually adjust it before it ships. After that, returns are handled per our Shipping & Returns policy.",
          },
          {
            q: "What discount codes are available?",
            a: "New releases are announced in our newsletter — subscribers hear about every drop first. Try WELCOME5 on your first order.",
          },
        ],
      },
      {
        heading: "Products & stock",
        items: [
          {
            q: "Are the pieces one of a kind?",
            a: "Many of our vintage and restored pieces are. When only a few remain, the shop page shows the live quantity for each item.",
          },
          {
            q: "What if something is out of stock?",
            a: "Sold-out pieces are restocked when our workshop finds another. Keep it in your wishlist and check back soon.",
          },
          {
            q: "Do you do custom work?",
            a: "Yes — see our Custom Orders page for how the process works.",
          },
        ],
      },
    ],
  },
  "shipping-returns": {
    eyebrow: "Delivery",
    title: "Shipping & Returns",
    intro:
      "Every order is wrapped with premium materials and tracked from our door to yours.",
    sections: [
      {
        heading: "Shipping",
        items: [
          {
            q: "What does shipping cost?",
            a: "A flat $12 shipping fee applies to every order, shown at checkout before you confirm.",
          },
          {
            q: "How long does delivery take?",
            a: "Orders are packed within 1–2 business days and typically arrive within 2–4 weeks, depending on your location.",
          },
          {
            q: "Can I track my order?",
            a: "Once your order ships, we send a tracking link by email or WhatsApp.",
          },
        ],
      },
      {
        heading: "Returns",
        items: [
          {
            q: "What is your return policy?",
            a: "Unworn, undamaged pieces can be returned within 14 days of delivery for a refund of the item price. Shipping fees are non-refundable.",
          },
          {
            q: "How do I start a return?",
            a: "Contact us with your order number (it starts with VT-) and we will walk you through the process.",
          },
          {
            q: "What if my piece arrives damaged?",
            a: "Send us a photo within 48 hours of delivery and we will replace or refund it — craftsmanship should survive the journey.",
          },
        ],
      },
    ],
  },
  "privacy-policy": {
    eyebrow: "Your data",
    title: "Privacy Policy",
    intro:
      "We collect the minimum needed to deliver your orders, and we never sell it.",
    sections: [
      {
        heading: "What we store",
        items: [
          {
            q: "Account details",
            a: "Your name, email, and optionally phone and address — used to process orders and keep your history handy.",
          },
          {
            q: "Order records",
            a: "The items, totals, and shipping details of each order you place, so support requests are quick to resolve.",
          },
          {
            q: "Newsletter email",
            a: "If you subscribe, just your email address — unsubscribe anytime from any newsletter.",
          },
        ],
      },
      {
        heading: "How we use it",
        items: [
          {
            q: "Do you share my data?",
            a: "Never sold, never rented. Shared only with the courier delivering your order.",
          },
          {
            q: "Can I delete my account?",
            a: "Contact us and we will remove your account and personal details from our records.",
          },
          {
            q: "Is payment secure?",
            a: "Card payments are handled by our payment provider; we never see or store your full card number.",
          },
        ],
      },
    ],
  },
  "custom-orders": {
    eyebrow: "Bespoke",
    title: "Custom Orders",
    intro:
      "Something specific in mind? Our workshop takes on a small number of bespoke and restoration projects.",
    sections: [
      {
        heading: "How it works",
        items: [
          {
            q: "1. Tell us your idea",
            a: "Send a message through the contact page with what you are dreaming of — materials, size, the feeling you are after.",
          },
          {
            q: "2. We scope the build",
            a: "We reply with a plan, a timeline, and a fixed quote. Custom work typically takes 2–4 weeks.",
          },
          {
            q: "3. We craft and deliver",
            a: "You get progress notes from the workshop, and the finished piece ships with the same care as the rest of the collection.",
          },
        ],
      },
      {
        heading: "Good to know",
        items: [
          {
            q: "What can be customized?",
            a: "Restored furniture, reworked garments, jewelry and leather goods are the most common requests.",
          },
          {
            q: "Is there a deposit?",
            a: "Custom projects begin with a 30% deposit; the balance is due before shipping.",
          },
          {
            q: "Do custom orders return?",
            a: "Because each piece is made to your spec, custom work is final sale — we will always agree the plan with you before building.",
          },
        ],
      },
    ],
  },
};

const InfoPage = () => {
  const { slug } = useParams();
  const page = PAGES[slug];

  if (!page) {
    return (
      <div className="mx-auto max-w-container-max px-margin-mobile py-stack-xl text-center md:px-margin-desktop">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Page not found
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block font-label-md text-label-md text-primary hover:underline"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-lg pb-stack-xl md:px-margin-desktop">
      {/* Header */}
      <div className="mb-stack-lg max-w-2xl">
        <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-tertiary">
          {page.eyebrow}
        </p>
        <h1 className="mt-2 font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          {page.title}
        </h1>
        <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant">
          {page.intro}
        </p>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
        {page.sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 soft-shadow md:p-8"
          >
            <h2 className="mb-6 font-headline-md text-headline-md text-primary">
              {section.heading}
            </h2>
            <div className="flex flex-col gap-4">
              {section.items.map((item, index) => (
                <div key={item.q}>
                  <details className="group cursor-pointer">
                    <summary className="flex list-none items-center justify-between font-label-md text-label-md text-on-surface outline-none transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <Icon
                        name="expand_more"
                        size={20}
                        className="shrink-0 text-on-surface-variant transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-2 border-l-2 border-primary-fixed-dim pl-4 font-body-md text-body-md text-on-surface-variant">
                      {item.a}
                    </p>
                  </details>
                  {index < section.items.length - 1 && (
                    <div className="mt-4 h-px w-full bg-outline-variant/30" />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-stack-lg flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary-fixed p-6 text-center sm:flex-row sm:p-8 sm:text-left">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-primary-fixed">
            Still have questions?
          </h3>
          <p className="mt-1 font-body-md text-body-md text-on-primary-fixed-variant">
            We answer every message personally, usually within a day.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
        >
          <Icon name="chat" size={18} />
          Contact us
        </Link>
      </div>
    </div>
  );
};

export default InfoPage;
