import { useState } from "react";
import Icon from "../components/Icon";
import toast from "react-hot-toast";

const WHATSAPP_URL = "https://wa.me/201147414322";

const CONTACT_INFO = [
  {
    icon: "location_on",
    label: "123 Artisan Alley, Creative District",
    href: null,
  },
  {
    icon: "mail",
    label: "hello@vintagestudio.com",
    href: "mailto:hello@vintagestudio.com",
  },
  {
    icon: "phone",
    label: "+20 114 741 4322",
    href: "tel:+201147414322",
  },
];

const FAQS = [
  {
    q: "Do you do custom orders?",
    a: "Yes, we specialize in bespoke creations tailored to your vision. Tell us your idea and we'll craft it.",
  },
  {
    q: "What is the typical turnaround time?",
    a: "Typically 2-4 weeks, depending on the complexity of the piece.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships, we'll send you a tracking link by email or WhatsApp.",
  },
];

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Your message has been delivered. We will respond shortly.",
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="relative w-full">
      {/* Background accents */}
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-80 w-80 -translate-y-1/4 translate-x-1/3 rounded-full bg-tertiary-fixed opacity-20 blur-3xl" />

      <main className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-md pb-stack-lg md:px-margin-desktop md:py-stack-lg">
        {/* Header */}
        <div className="mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Get in Touch
          </h1>
          <p className="mt-2 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            Have a question about an order, a custom request, or just want to
            say hello? We'd love to hear from you.
          </p>
        </div>

        {/* Contact info strip */}
        <div className="mb-stack-lg grid grid-cols-1 gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 soft-shadow sm:grid-cols-3">
          {CONTACT_INFO.map((info) => (
            <div
              key={info.icon}
              className="flex items-center gap-3 font-body-md text-body-md text-on-surface"
            >
              <Icon name={info.icon} className="shrink-0 text-primary" />
              {info.href ? (
                <a
                  href={info.href}
                  className="transition-colors hover:text-primary"
                >
                  {info.label}
                </a>
              ) : (
                <span>{info.label}</span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-gutter md:grid-cols-2">
          {/* Form */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 soft-shadow md:p-8">
            <h2 className="mb-6 font-headline-md text-headline-md text-primary">
              Send a Missive
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subject"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Subject{" "}
                  <span className="font-body-md text-body-md font-normal normal-case tracking-normal text-on-surface-variant">
                    (optional)
                  </span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is it about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex items-center justify-center gap-2 self-start rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
              >
                <Icon name="send" size={18} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* WhatsApp CTA + FAQs */}
          <div className="flex flex-col gap-gutter">
            {/* WhatsApp CTA */}
            <div className="flex items-center justify-between rounded-xl bg-tertiary-container p-8 text-on-tertiary-container soft-shadow">
              <div>
                <h3 className="mb-2 font-headline-md text-[24px] font-semibold leading-8">
                  Need it quick?
                </h3>
                <p className="font-body-md text-body-md opacity-90">
                  Chat with us directly on WhatsApp.
                </p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface text-tertiary transition-transform hover:scale-105"
              >
                <Icon name="chat" size={28} />
              </a>
            </div>

            {/* FAQs */}
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 soft-shadow">
              <h3 className="mb-6 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
                Common Questions
              </h3>
              <div className="flex flex-col gap-4">
                {FAQS.map((faq, index) => (
                  <div key={faq.q}>
                    <details className="group cursor-pointer">
                      <summary className="flex list-none items-center justify-between font-label-md text-label-md text-primary outline-none [&::-webkit-details-marker]:hidden">
                        {faq.q}
                        <Icon
                          name="expand_more"
                          size={20}
                          className="shrink-0 transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <p className="mt-2 border-l-2 border-primary-fixed-dim pl-4 font-body-md text-body-md text-on-surface-variant">
                        {faq.a}
                      </p>
                    </details>
                    {index < FAQS.length - 1 && (
                      <div className="mt-4 h-px w-full bg-outline-variant/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
