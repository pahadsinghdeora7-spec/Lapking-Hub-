import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./account.css";   // ✅ CORRECT PATH

export default function Account() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ ADMIN EMAIL
  const ADMIN_EMAIL = "pahadsinghdeora7@gmail.com";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
    });
  }, []);

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

        {/* ✅ ADMIN PANEL OPTION */}
        {user?.email === ADMIN_EMAIL && (
          <div
            className="account-item"
            onClick={() => navigate("/admin")}
            style={{ cursor: "pointer" }}
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
