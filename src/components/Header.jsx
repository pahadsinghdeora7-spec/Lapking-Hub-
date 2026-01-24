import { useState } from "react";
import { Link } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          height: "55px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1px solid #eee",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              fontSize: "22px",
              background: "none",
              border: "none"
            }}
          >
            ☰
          </button>

          <span style={{ fontWeight: "600" }}>👑 LapkingHub</span>
        </div>

        {/* RIGHT ICONS */}
        <div style={{ display: "flex", gap: "14px", fontSize: "20px" }}>
          <Link to="/wishlist">❤️</Link>
          <Link to="/cart">🛒</Link>
        </div>
      </header>

      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
