import { useNavigate, useLocation } from "react-router-dom";
import {
  MdHome,
  MdCategory,
  MdShoppingCart,
  MdPerson,
  MdReceiptLong
} from "react-icons/md";
import { useEffect, useState } from "react";
import "./bottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  // 🔐 simple login check
  const isLoggedIn = () => {
    const user = localStorage.getItem("user");
    return !!user;
  };

  // 🛒 cart count
  const updateCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () =>
      window.removeEventListener("cartUpdated", updateCart);
  }, []);

  // 🔐 protected navigation
  const goProtected = (path) => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bottom-nav">

      {/* HOME */}
      <div
        className={location.pathname === "/" ? "active" : ""}
        onClick={() => navigate("/")}
      >
        <MdHome />
        <span>Home</span>
      </div>

      {/* CATEGORIES */}
      <div
        className={location.pathname === "/categories" ? "active" : ""}
        onClick={() => navigate("/categories")}
      >
        <MdCategory />
        <span>Categories</span>
      </div>

      {/* CART */}
      <div
        style={{ position: "relative" }}
        className={location.pathname === "/cart" ? "active" : ""}
        onClick={() => navigate("/cart")}
      >
        <MdShoppingCart />
        {cartCount > 0 && (
          <span className="cart-badge">{cartCount}</span>
        )}
        <span>Cart</span>
      </div>

      {/* ORDERS (login required) */}
      <div
        className={location.pathname === "/orders" ? "active" : ""}
        onClick={() => goProtected("/orders")}
      >
        <MdReceiptLong />
        <span>Orders</span>
      </div>

      {/* ACCOUNT (login required) */}
      <div
        className={location.pathname === "/account" ? "active" : ""}
        onClick={() => goProtected("/account")}
      >
        <MdPerson />
        <span>Account</span>
      </div>

    </div>
  );
}
