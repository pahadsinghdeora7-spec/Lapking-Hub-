import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";
import SearchBar from "./SearchBar";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // cart count live update
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce(
      (sum, item) => sum + (item.qty || 1),
      0
    );
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
      {/* ================= HEADER ================= */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* MENU BUTTON */}
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

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }}
          >
            <img
              src="/logo.png"
              alt="LapkingHub"
              style={{
                width: "32px",
                height: "32px",
                objectFit: "contain"
              }}
            />

            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0b5ed7"
              }}
            >
              LapkingHub
            </span>
          </div>
        </div>

        {/* RIGHT ICONS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
            fontSize: "22px",
            position: "relative"
          }}
        >
          {/* CART */}
          <Link to="/cart" style={{ position: "relative", color: "#000" }}>
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

          {/* ACCOUNT */}
          <Link to="/account" style={{ color: "#000" }}>
            👤
          </Link>
        </div>
      </header>

      {/* SEARCH BAR */}
      <SearchBar />

      {/* DRAWER MENU */}
      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
            }
