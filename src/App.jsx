import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";

/* USER PAGES */
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";

import CategoryProducts from "./pages/CategoryProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import Login from "./pages/Login.jsx";

/* CHECKOUT */
import CheckoutAddress from "./pages/CheckoutAddress.jsx";
import CheckoutShipping from "./pages/CheckoutShipping.jsx";
import CheckoutPayment from "./pages/CheckoutPayment";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import ReplacementRequest from "./pages/ReplacementRequest.jsx";

/* ADMIN */
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
/* ADMIN PRODUCT */
import AdminProducts from "./admin/AdminProducts.jsx";
import AddProductPage from "./admin/AddProductPage.jsx";

import AdminBulkDelete from "./admin/AdminBulkDelete.jsx";
import AdminBulkUpload from "./admin/AdminBulkUpload.jsx";
import AdminCategories from "./admin/AdminCategories.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminOrderView from "./admin/AdminOrderView.jsx";
import AdminReplacements from "./admin/AdminReplacements.jsx";
import AdminCouriers from "./admin/AdminCouriers.jsx";
import AdminSettings from "./admin/AdminSettings.jsx";

import AdminCustomers from "./admin/AdminCustomers.jsx";
/* COMPONENTS */
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="app-root">

      {/* ✅ FRONTEND HEADER ONLY */}
      {!isAdmin && <Header />}

      <main className="app-main">
        <Routes>

          {/* USER ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          
          <Route path="/category/:slug" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />

          {/* CHECKOUT */}
          <Route path="/checkout/address" element={<CheckoutAddress />} />
          <Route path="/checkout/shipping" element={<CheckoutShipping />} />
          <Route path="/checkout/payment" element={<CheckoutPayment />} />

          <Route path="/order/success" element={<OrderSuccess />} />

          {/* REPLACEMENT */}
          <Route
            path="/replacement/order/:id/product/:productId"
            element={<ReplacementRequest />}
          />

          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN PANEL */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="/admin/products/add" element={<AddProductPage />} />
            <Route path="products/bulk-upload" element={<AdminBulkUpload />} />
            <Route path="customers" element={<AdminCustomers />} />

             <Route path="/admin/products/bulk-delete" element={<AdminBulkDelete />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderView />} />
            <Route path="replacements" element={<AdminReplacements />} />
            <Route path="couriers" element={<AdminCouriers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

        </Routes>
      </main>

      {/* ✅ FRONTEND NAV ONLY */}
      {!isAdmin && <BottomNav />}

      {/* WhatsApp always */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
