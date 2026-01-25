import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MdHome,
  MdCategory,
  MdShoppingCart,
  MdPerson
} from "react-icons/md";
import "./bottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();

  // ✅ CART COUNT STATE
  const [cartCount, setCartCount] = useState(0);

  // ✅ CART COUNT AUTO UPDATE
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce(
        (sum, item) => sum + (item.qty || 1),
        0
      );
      setCartCount(totalQty);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <div className="bottom-nav">

      {/* HOME */}
      <div onClick={() => navigate("/")}>
        <MdHome size={22} />
        <span>Home</span>
      </div>

      {/* CATEGORIES */}
      <div onClick={() => navigate("/categories")}>
        <MdCategory size={22} />
        <span>Categories</span>
      </div>

      {/* CART WITH COUNT */}
      <div
        onClick={() => navigate("/cart")}
        className="cart-icon"
      >
        <MdShoppingCart size={22} />

        {cartCount > 0 && (
          <span className="cart-badge">{cartCount}</span>
        )}

        <span>Cart</span>
      </div>

      {/* ACCOUNT */}
      <div onClick={() => navigate("/account")}>
        <MdPerson size={22} />
        <span>Account</span>
      </div>

    </div>
  );
        }
