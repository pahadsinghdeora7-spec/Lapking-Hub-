import { useState } from "react";
import { Link } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          height: "70px",                 // 🔼 height increase
          background: "#e6f2ff",          // 🩵 light blue
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #d6e9ff",
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
              fontSize: "24px",
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
          >
            ☰
          </button>

          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#0b5ed7"
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
            gap: "22px",          // 🔥 icon spacing
            fontSize: "22px"
          }}
        >
          <Link to="/wishlist">🔖</Link>
          <Link to="/cart">🛒</Link>
        </div>
      </header>

      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
