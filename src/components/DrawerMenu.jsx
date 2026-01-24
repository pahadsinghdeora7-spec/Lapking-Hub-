import { Link } from "react-router-dom";
import "./drawerMenu.css";

export default function DrawerMenu({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="drawer-backdrop" onClick={onClose}></div>
      )}

      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-logo">👑 LapkingHub</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        <ul className="drawer-menu">
          <li><Link to="/" onClick={onClose}>Home</Link></li>
          <li><Link to="/categories" onClick={onClose}>Categories</Link></li>
          <li><Link to="/rewards" onClick={onClose}>🎁 Rewards</Link></li>
          <li><Link to="/orders" onClick={onClose}>Orders</Link></li>
          <li><Link to="/account" onClick={onClose}>Account</Link></li>

          <hr />

          <li><Link to="/policies" onClick={onClose}>Policies</Link></li>
          <li><Link to="/about" onClick={onClose}>About Us</Link></li>
          <li><Link to="/contact" onClick={onClose}>Contact Us</Link></li>

          <li className="logout">Logout</li>
        </ul>
      </div>
    </>
  );
}
