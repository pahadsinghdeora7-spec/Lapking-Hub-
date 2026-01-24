export default function DrawerMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "260px",
        height: "100vh",
        background: "#fff",
        zIndex: 999,
        padding: "20px",
        boxShadow: "2px 0 10px rgba(0,0,0,.15)"
      }}
    >
      <button onClick={onClose}>✖</button>

      <p>Home</p>
      <p>Categories</p>
      <p>Orders</p>
      <p>Account</p>

      <hr />

      <p style={{ color: "red" }}>Logout</p>
    </div>
  );
}
