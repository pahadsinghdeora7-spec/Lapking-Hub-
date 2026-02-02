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
  const [user, setUser] = useState(null);

  // ======================
  // LOAD USER (LOGIN STATE)
  // ======================
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]); // route change par re-check

  // ======================
  // CART COUNT
  // ======================
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

      {/* ORDERS — 🔐 LOGIN KE BAAD HI DIKHE */}
      {user && (
        <div
          className={location.pathname === "/orders" ? "active" : ""}
          onClick={() => navigate("/orders")}
        >
          <MdReceiptLong />
          <span>Orders</span>
        </div>
      )}

      {/* ACCOUNT / LOGIN */}
      <div
        className={location.pathname === "/account" ? "active" : ""}
        onClick={() =>
          user ? navigate("/account") : navigate("/login")
        }
      >
        <MdPerson />
        <span>{user?.name || "Login"}</span>
      </div>

    </div>
  );
}
