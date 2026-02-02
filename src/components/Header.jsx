import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";
import SearchBar from "./SearchBar";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // ================= CART COUNT =================
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

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // ================= SEARCH BAR CONTROL =================
  const showSearch =
    location.pathname === "/" ||
    location.pathname === "/categories" ||
    location.pathname.startsWith("/category/") ||
    location.pathname.startsWith("/search/");

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
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* MENU */}
          <button
            aria-label="Open menu"
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

      {/* 🔽 SPACE FIX */}
      <div style={{ height: "72px" }} />

      {/* 🔍 SEARCH BAR (CONTROLLED) */}
      {showSearch && <SearchBar />}

      {/* DRAWER */}
      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
                }
