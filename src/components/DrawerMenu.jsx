import { Link } from "react-router-dom";

export default function DrawerMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* DARK OVERLAY */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          zIndex: 999
        }}
      />

      {/* DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "260px",
          height: "100vh",
          background: "#fff",
          zIndex: 1000,
          padding: "20px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
          animation: "slideIn 0.25s ease"
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "none",
            fontSize: "22px",
            marginBottom: "20px",
            cursor: "pointer"
          }}
        >
          ✕
        </button>

        <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/categories" onClick={onClose}>Categories</Link>
          <Link to="/orders" onClick={onClose}>Orders</Link>
          <Link to="/account" onClick={onClose}>Account</Link>

          <hr />

          <button
            style={{
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  );
}
