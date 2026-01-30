import { Link } from "react-router-dom";

export default function DrawerMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        zIndex: 200
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "260px",
          height: "100%",
          background: "#fff",
          padding: "18px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 20 }}>
          <strong style={{ fontSize: 18 }}>👑 LapkingHub</strong>
        </div>

        {/* MAIN MENU */}
        <Link onClick={onClose} to="/">Home</Link><br /><br />
        <Link onClick={onClose} to="/categories">Categories</Link><br /><br />
        <Link onClick={onClose} to="/orders">My Orders</Link><br /><br />
        <Link onClick={onClose} to="/wishlist">Wishlist</Link><br /><br />
        <Link onClick={onClose} to="/account">My Account</Link>

        <hr style={{ margin: "20px 0" }} />

        {/* POLICIES */}
        <Link onClick={onClose} to="/page/privacy-policy">Privacy Policy</Link><br /><br />
        <Link onClick={onClose} to="/page/terms-conditions">Terms & Conditions</Link><br /><br />
        <Link onClick={onClose} to="/page/refund-policy">Refund Policy</Link><br /><br />
        <Link onClick={onClose} to="/page/shipping-policy">Shipping Policy</Link><br /><br />
        <Link onClick={onClose} to="/page/warranty-policy">Warranty Policy</Link>

        <hr style={{ margin: "20px 0" }} />

        {/* COMPANY */}
        <Link onClick={onClose} to="/page/about-us">About Us</Link><br /><br />
        <Link onClick={onClose} to="/page/contact-us">Contact Us</Link>
      </div>
    </div>
  );
}
