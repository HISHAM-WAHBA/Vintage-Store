import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "+201147414322";
const whatsappUrl = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`
  : undefined;

const LayoutMain = () => (
  <div className="flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface antialiased">
    <Navbar />
    <main className="grow pb-28 md:pb-0">
      <Outlet />
    </main>
    <Footer />
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-28 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#236756] text-3xl text-white shadow-[0_10px_30px_rgba(35,103,86,0.3)] transition hover:scale-110 hover:bg-[#1b5244] focus:outline-none focus:ring-4 focus:ring-tertiary/40 md:bottom-6 md:left-6"
    >
      <FaWhatsapp aria-hidden="true" />
    </a>
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#34302c",
          color: "#f8efea",
          border: "1px solid #dcbfc6",
          borderRadius: "12px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        },
      }}
    />
  </div>
);

export default LayoutMain;
