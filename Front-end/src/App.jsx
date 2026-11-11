import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutMain from "./layout/LayoutMain";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import WishlistPage from "./pages/WishlistPage";
import InfoPage from "./pages/InfoPage";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LayoutMain />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="dashboard" element={<CustomerDashboardPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="info/:slug" element={<InfoPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="auth/callback" element={<AuthCallbackPage />} />

              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center py-24 text-center">
                    <p className="font-headline-lg text-headline-lg text-on-surface">
                      404 — Page Not Found
                    </p>
                    <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                      The page you're after has wandered off.
                    </p>
                  </div>
                }
              />
            </Route>
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
