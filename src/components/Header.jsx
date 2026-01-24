import { useState } from "react";
import { Link } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

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
            gap: "24px",
            fontSize: "22px"
          }}
        >
          <Link to="/cart">🛒</Link>
          <Link to="/account">👤</Link>
        </div>
      </header>

      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
