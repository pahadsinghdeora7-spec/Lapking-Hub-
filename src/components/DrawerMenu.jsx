export default function DrawerMenu({ open, onClose }) {
  return (
    <div
      style={{
        display: open ? "block" : "none",

        position: "fixed",
        top: 0,
        left: 0,
        width: "260px",
        height: "100vh",
        background: "#ffffff",
        zIndex: 9999,
        padding: "20px",
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)"
      }}
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        style={{
          fontSize: "18px",
          border: "none",
          background: "none",
          marginBottom: "20px",
          cursor: "pointer"
        }}
      >
        ✖
      </button>

      <p>Home</p>
      <p>Categories</p>
      <p>Orders</p>
      <p>Account</p>

      <hr />

      <p style={{ color: "red", marginTop: "20px" }}>
        Logout
      </p>
    </div>
  );
}
