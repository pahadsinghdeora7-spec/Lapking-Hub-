import { Link, useNavigate } from "react-router-dom";
import "./account.css";

export default function Account() {

  const navigate = useNavigate();

  // ✅ TEMP ADMIN ACCESS (jab tak login nahi hai)
  const isAdmin = true;

  return (
    <div className="account-page">

      {/* PROFILE */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>Wholesale Laptop Accessories</p>
      </div>

      {/* MENU */}
      <div className="account-menu">

        <Link to="/orders" className="account-item">
          📦 My Orders
        </Link>

        <Link to="/wishlist" className="account-item">
          ⭐ Wishlist
        </Link>

        <Link to="/rewards" className="account-item">
          🎁 Rewards
        </Link>

        <Link to="/policies" className="account-item">
          📄 Policies
        </Link>

        <Link to="/contact" className="account-item">
          📞 Contact Us
        </Link>

        {/* ✅ ADMIN PANEL */}
        {isAdmin && (
          <div
            className="account-item"
            onClick={() => navigate("/admin")}
            style={{
              cursor: "pointer",
              fontWeight: "600",
              color: "#0d6efd"
            }}
          >
            🛠 Admin Panel
          </div>
        )}

      </div>

      {/* LOGOUT */}
      <button className="logout-btn">
        Logout
      </button>

    </div>
  );
}
