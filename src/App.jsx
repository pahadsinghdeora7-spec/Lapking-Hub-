import { HashRouter as Router, Routes, Route } from "react-router-dom";

/* USER PAGES */
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import Categories from "./pages/Categories.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";

/* CHECKOUT */
import CheckoutAddress from "./pages/CheckoutAddress.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import ReplacementRequest from "./pages/ReplacementRequest.jsx";

/* ADMIN */
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

/* COMPONENTS */
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

export default function App() {
  return (
    <Router>
      <div className="app-root">

        {/* HEADER */}
        <Header />

        <main className="app-main">
          <Routes>

            {/* USER ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />

            {/* CHECKOUT */}
            {/* CHECKOUT */}
<Route path="/checkout">
  <Route path="address" element={<CheckoutAddress />} />
</Route>
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
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderView />} />
              <Route path="replacements" element={<AdminReplacements />} />
              <Route path="couriers" element={<AdminCouriers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

          </Routes>
        </main>

        {/* BOTTOM NAV */}
        <BottomNav />

        {/* WHATSAPP */}
        <WhatsAppButton />

      </div>
    </Router>
  );
            }
