import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "+201147414322";

const LayoutMain = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="flex flex-col min-h-screen bg-vintage-cream text-vintage-text font-sans selection:bg-vintage-gold selection:text-vintage-brown">
      {!isAdminPage && <Navbar />}
      <main
        className={`grow ${
          isAdminPage ? "" : `pb-20 lg:pb-0 ${!isHomePage ? "pt-28" : ""}`
        }`}
      >
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && (
        <a
          href={
            WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معنا عبر واتساب"
          title="تواصل معنا عبر واتساب"
          className={`fixed bottom-24 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-3xl text-white shadow-lg transition hover:scale-110 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 lg:bottom-6 ${
            !WHATSAPP_NUMBER ? "cursor-not-allowed opacity-70" : ""
          }`}
          onClick={(event) => {
            if (!WHATSAPP_NUMBER) event.preventDefault();
          }}
        >
          <FaWhatsapp aria-hidden="true" />
        </a>
      )}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#5D4037",
            color: "#FDF5E6",
            border: "1px solid #C5A065",
            fontFamily: "Lato, sans-serif",
          },
        }}
      />
    </div>
  );
};

export default LayoutMain;
