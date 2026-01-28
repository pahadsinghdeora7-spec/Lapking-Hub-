import { Link } from "react-router-dom";

export default function DrawerMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 999,
        }}
      />

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          background: "#fff",
          zIndex: 1000,
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 15px rgba(0,0,0,0.25)",
          animation: "slideIn 0.25s ease",
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <strong style={{ fontSize: "18px", color: "#1976ff" }}>
            👑 LapkingHub
          </strong>
        </div>

        <hr style={{ margin: "15px 0" }} />

        {/* MENU */}
        <div style={{ flex: 1 }}>
          <MenuItem to="/" text="Home" onClose={onClose} />
          <MenuItem to="/categories" text="Categories" onClose={onClose} />
          <MenuItem to="/orders" text="My Orders" onClose={onClose} />
          <MenuItem to="/wishlist" text="Wishlist" onClose={onClose} />
          <MenuItem to="/rewards" text="Rewards" onClose={onClose} />
          <MenuItem to="/account" text="My Account" onClose={onClose} />

          <hr style={{ margin: "15px 0" }} />

          {/* ✅ POLICIES (CMS BASED) */}
          <MenuItem
            to="/page/privacy-policy"
            text="Privacy Policy"
            onClose={onClose}
          />
          <MenuItem
            to="/page/terms-conditions"
            text="Terms & Conditions"
            onClose={onClose}
          />
          <MenuItem
            to="/page/refund-policy"
            text="Refund Policy"
            onClose={onClose}
          />
          <MenuItem
            to="/page/shipping-policy"
            text="Shipping Policy"
            onClose={onClose}
          />

          <hr style={{ margin: "15px 0" }} />

          {/* ABOUT */}
          <MenuItem to="/page/about-us" text="About Us" onClose={onClose} />
        </div>

        {/* LOGOUT */}
        <button
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "12px",
            background: "#ff3b3b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </>
  );
}

/* MENU ITEM */
function MenuItem({ to, text, onClose }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      style={{
        display: "block",
        padding: "12px 8px",
        textDecoration: "none",
        color: "#222",
        fontSize: "15px",
        fontWeight: "500",
        borderRadius: "6px",
      }}
    >
      {text}
    </Link>
  );
}
