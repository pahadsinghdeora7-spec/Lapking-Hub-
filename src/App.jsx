// ===================================
// REACT ROUTER
// ===================================
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// ===================================
// USER PAGES
// ===================================
import Home from "./pages/Home.jsx";
import Categories from "./pages/Categories.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import Account from "./pages/Account.jsx";

import CheckoutAddress from "./pages/CheckoutAddress.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import ReplacementRequest from "./pages/ReplacementRequest.jsx";


// ===================================
// ADMIN PAGES
// ===================================
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import AdminCategories from "./admin/AdminCategories.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminOrderView from "./admin/AdminOrderView.jsx";
import AdminReplacements from "./admin/AdminReplacements.jsx";
import AdminCouriers from "./admin/AdminCouriers.jsx";
import AdminSettings from "./admin/AdminSettings.jsx";


// ===================================
// COMMON COMPONENTS
// ===================================
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";


// ===================================
// MAIN APP
// ===================================
export default function App() {
  return (
    <Router>

      {/* FULL APP WRAPPER */}
      <div className="app-root">

        {/* TOP HEADER */}
        <Header />

        {/* MAIN CONTENT */}
        <main className="app-main">

          <Routes>

            {/* ===================================
                USER ROUTES
            =================================== */}

            <Route path="/" element={<Home />} />

            <Route path="/categories" element={<Categories />} />

            <Route
              path="/category/:slug"
              element={<CategoryProducts />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            <Route path="/cart" element={<Cart />} />

            <Route path="/orders" element={<Orders />} />

            <Route path="/account" element={<Account />} />

            {/* CHECKOUT */}
            <Route
              path="/checkout/address"
              element={<CheckoutAddress />}
            />

            <Route
              path="/order/success"
              element={<OrderSuccess />}
            />

            {/* REPLACEMENT */}
            <Route
              path="/replacement/order/:id/product/:productId"
              element={<ReplacementRequest />}
            />


            {/* ===================================
                ADMIN LOGIN
            =================================== */}

            <Route
              path="/admin/login"
              element={<AdminLogin />}
            />


            {/* ===================================
                ADMIN PANEL ROUTES
                (NESTED ROUTES)
            =================================== */}

            <Route path="/admin" element={<AdminLayout />}>

              {/* Dashboard */}
              <Route index element={<AdminDashboard />} />

              {/* Admin Products */}
              <Route path="products" element={<AdminProducts />} />

              {/* Admin Categories */}
              <Route path="categories" element={<AdminCategories />} />

              {/* Admin Orders */}
              <Route path="orders" element={<AdminOrders />} />

              {/* Single Order View */}
              <Route path="orders/:id" element={<AdminOrderView />} />

              {/* Replacement Requests */}
              <Route
                path="replacements"
                element={<AdminReplacements />}
              />

              {/* Couriers */}
              <Route path="couriers" element={<AdminCouriers />} />

              {/* Settings */}
              <Route path="settings" element={<AdminSettings />} />

            </Route>

          </Routes>

        </main>


        {/* BOTTOM NAV (MOBILE) */}
        <BottomNav />

        {/* FLOATING WHATSAPP BUTTON */}
        <WhatsAppButton />

      </div>

    </Router>
  );
              }
