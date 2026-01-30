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
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "16px"
          }}
        >
          👑 LapkingHub
        </div>

        {/* MAIN LINKS */}
        <Link className="drawer-link" to="/" onClick={onClose}>
          Home
        </Link>

        <Link className="drawer-link" to="/categories" onClick={onClose}>
          Categories
        </Link>

        <Link className="drawer-link" to="/my-orders" onClick={onClose}>
          My Orders
        </Link>

        <Link className="drawer-link" to="/wishlist" onClick={onClose}>
          Wishlist
        </Link>

        <Link className="drawer-link" to="/rewards" onClick={onClose}>
          Rewards
        </Link>

        <Link className="drawer-link" to="/account" onClick={onClose}>
          My Account
        </Link>

        <hr />

        {/* POLICIES */}
        <Link
          className="drawer-link"
          to="/page/warranty-policy"
          onClick={onClose}
        >
          Warranty Policy
        </Link>

        <Link
          className="drawer-link"
          to="/page/shipping-policy"
          onClick={onClose}
        >
          Shipping Policy
        </Link>

        <Link
          className="drawer-link"
          to="/page/refund-policy"
          onClick={onClose}
        >
          Refund Policy
        </Link>

        <Link
          className="drawer-link"
          to="/page/terms-conditions"
          onClick={onClose}
        >
          Terms & Conditions
        </Link>

        <Link
          className="drawer-link"
          to="/page/privacy-policy"
          onClick={onClose}
        >
          Privacy Policy
        </Link>

        <hr />

        {/* ABOUT + CONTACT */}
        <Link
          className="drawer-link"
          to="/page/about-us"
          onClick={onClose}
        >
          About Us
        </Link>

        {/* ✅ NEW — CONTACT US */}
        <Link
          className="drawer-link"
          to="/page/contact-us"
          onClick={onClose}
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
