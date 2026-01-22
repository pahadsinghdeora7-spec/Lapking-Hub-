// src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

/* ================= USER PAGES ================= */
import Home from "./pages/Home.jsx";
import Categories from "./pages/Categories.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import Account from "./pages/Account.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import CheckoutShipping from "./pages/CheckoutShipping";
import CheckoutAddress from "./pages/CheckoutAddress";
import OrderSuccess from "./pages/OrderSuccess";

/* ================= ADMIN PAGES ================= */
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import AdminCategories from "./admin/AdminCategories.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";

/* ================= COMMON ================= */
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

export default function App() {
  return (
    <Router>
      <div className="app-root">

        {/* ===== HEADER ===== */}
        <Header />

        {/* ===== MAIN ===== */}
        <main className="app-main">
          <Routes>

            {/* ================= USER ROUTES ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/account" element={<Account />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
            <Route path="/checkout/shipping" element={<CheckoutShipping />} />
            <Route path="/checkout/address" element={<CheckoutAddress />} />
            <Route path="/order/success/:id" element={<OrderSuccess />} />
            <Route
  path="/replacement/:orderId/:productId"
  element={<ReplacementRequest />}
/>
            {/* ================= ADMIN ROUTES ================= */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderView />} />
            </Route>

          </Routes>
        </main>

        {/* ===== BOTTOM ===== */}
        <BottomNav />
        <WhatsAppButton />

      </div>
    </Router>
  );
}
