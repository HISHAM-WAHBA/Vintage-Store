import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutMain from "./layout/LayoutMain";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LayoutMain />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="auth" element={<AuthPage />} />

            <Route
              path="*"
              element={
                <div className="text-center py-20 text-vintage-brown font-serif text-xl">
                  404 - Page Not Found
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
