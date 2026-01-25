import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // 🔥 cart count live update
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <>
      <header
        style={{
          height: "72px",
          background: "#e6f2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #cce0ff",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              fontSize: "26px",
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
          >
            ☰
          </button>

          {/* 🔥 LOGO CLICK → HOME */}
          <span
            onClick={() => navigate("/")}
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#0b5ed7",
              cursor: "pointer"
            }}
          >
            👑 LapkingHub
          </span>
        </div>

        {/* RIGHT ICONS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "22px",
            position: "relative"
          }}
        >
          {/* 🛒 CART WITH COUNT */}
          <Link to="/cart" style={{ position: "relative" }}>
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-10px",
                  background: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: "11px",
                  padding: "2px 6px",
                  fontWeight: "600"
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/account">👤</Link>
        </div>
      </header>

      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
          }
