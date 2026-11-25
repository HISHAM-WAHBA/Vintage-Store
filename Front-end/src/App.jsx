import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutMain from "./layout/LayoutMain";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CategoryPage from "./pages/CategoryPage";
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
import { useSeo } from "./utils/seo";

/** Account and checkout views must never compete with catalog pages in search. */
const PrivateSeo = ({ title, children }) => {
  useSeo({ title, noindex: true });
  return children;
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LayoutMain />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route
                path="cart"
                element={
                  <PrivateSeo title="Your Cart">
                    <CartPage />
                  </PrivateSeo>
                }
              />
              <Route
                path="checkout"
                element={
                  <PrivateSeo title="Checkout">
                    <CheckoutPage />
                  </PrivateSeo>
                }
              />
              <Route
                path="order-success"
                element={
                  <PrivateSeo title="Order Confirmed">
                    <OrderSuccessPage />
                  </PrivateSeo>
                }
              />
              <Route
                path="dashboard"
                element={
                  <PrivateSeo title="My Account">
                    <CustomerDashboardPage />
                  </PrivateSeo>
                }
              />
              <Route
                path="wishlist"
                element={
                  <PrivateSeo title="Wishlist">
                    <WishlistPage />
                  </PrivateSeo>
                }
              />
              <Route path="info/:slug" element={<InfoPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route
                path="auth"
                element={
                  <PrivateSeo title="Sign In">
                    <AuthPage />
                  </PrivateSeo>
                }
              />
              <Route
                path="auth/callback"
                element={
                  <PrivateSeo title="Signing In">
                    <AuthCallbackPage />
                  </PrivateSeo>
                }
              />

              <Route
                path="*"
                element={
                  <PrivateSeo title="Page Not Found">
                    <div className="flex flex-col items-center py-24 text-center">
                      <p className="font-headline-lg text-headline-lg text-on-surface">
                        404 — Page Not Found
                      </p>
                      <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                        The page you're after has wandered off.
                      </p>
                    </div>
                  </PrivateSeo>
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
