import { Link } from "react-router-dom";
import "./drawer.css";

export default function DrawerMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="drawer-backdrop" onClick={onClose}></div>

      {/* DRAWER */}
      <div className="drawer">

        {/* HEADER */}
        <div className="drawer-header">
          <span>👑 LapkingHub</span>
          <button onClick={onClose}>✕</button>
        </div>

        {/* MAIN MENU */}
        <div className="drawer-section">
          <Link to="/" onClick={onClose}>🏠 Home</Link>
          <Link to="/categories" onClick={onClose}>📂 Categories</Link>
          <Link to="/rewards" onClick={onClose}>🔥 Rewards</Link>
          <Link to="/orders" onClick={onClose}>📦 Orders</Link>
          <Link to="/account" onClick={onClose}>👤 Account</Link>
        </div>

        <hr />

        {/* EXTRA */}
        <div className="drawer-section">
          <Link to="/policies" onClick={onClose}>📄 Policies</Link>
          <Link to="/about" onClick={onClose}>ℹ️ About Us</Link>
          <Link to="/contact" onClick={onClose}>📞 Contact Us</Link>
        </div>

        {/* LOGOUT */}
        <button className="drawer-logout">
          Logout
        </button>

      </div>
    </>
  );
}
