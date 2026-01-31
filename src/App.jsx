import { HashRouter as Router, Routes, Route } from "react-router-dom";

/* ================= USER PAGES ================= */
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import Categories from "./pages/Categories.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import About from "./pages/About.jsx";
import PageView from "./pages/PageView";

/* ================= CHECKOUT ================= */
import CheckoutAddress from "./pages/CheckoutAddress.jsx";
import CheckoutShipping from "./pages/CheckoutShipping.jsx";
import CheckoutPayment from "./pages/CheckoutPayment.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import ReplacementRequest from "./pages/ReplacementRequest.jsx";

/* ================= ADMIN ================= */
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import AdminCategories from "./admin/AdminCategories.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";

import AdminReplacements from "./admin/AdminReplacements.jsx";
import AdminCouriers from "./admin/AdminCouriers.jsx";
import AdminSettings from "./admin/AdminSettings.jsx";
import AdminAbout from "./admin/AdminAbout.jsx";
import AdminPolicies from "./admin/AdminPolicies.jsx";

/* ================= COMPONENTS ================= */
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

export default function App() {
  return (
    <Router>
      <div className="app-root">

        <Header />

        <main className="app-main">
          <Routes>

            {/* ================= USER ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/account" element={<Account />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            

            {/* âœ… ALL POLICIES + CMS PAGES */}
            <Route path="/page/:slug" element={<PageView />} />

            {/* ABOUT */}
            <Route path="/about-us" element={<About />} />

            {/* ================= CHECKOUT ================= */}
            <Route path="/checkout/address" element={<CheckoutAddress />} />
            <Route path="/checkout/shipping" element={<CheckoutShipping />} />
            <Route path="/checkout/payment" element={<CheckoutPayment />} />
            <Route path="/order/success" element={<OrderSuccess />} />

            {/* ================= REPLACEMENT ================= */}
            <Route
              path="/replacement/order/:id/product/:productId"
              element={<ReplacementRequest />}
            />

            {/* ================= ADMIN ================= */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              
              <Route path="replacements" element={<AdminReplacements />} />
              <Route path="couriers" element={<AdminCouriers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="policies" element={<AdminPolicies />} />
            </Route>

          </Routes>
        </main>

        <BottomNav />
        <WhatsAppButton />

      </div>
    </Router>
  );
}
