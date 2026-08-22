import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";

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
