import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // ===============================
  // LOAD SESSION + PROFILE
  // ===============================
  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      // ❌ not logged in
      if (!user) {
        localStorage.setItem("redirect_after_login", "/account");
        navigate("/login");
        return;
      }

      setUser(user);

      // ✅ fetch profile
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }

      setLoading(false);
    }

    loadAccount();
  }, [navigate]);

  // ===============================
  // LOGOUT
  // ===============================
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading account...
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="account-page">

      {/* PROFILE HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>

        <h3>
          {profile?.full_name || "Customer"}
        </h3>

        <p>{profile?.email || user.email}</p>

        {profile?.mobile && (
          <p>📞 +91 {profile.mobile}</p>
        )}
      </div>

      {/* MENU */}
      <div className="account-menu">

        <div
          className="account-item"
          onClick={() => navigate("/orders")}
        >
          📦 My Orders
          <span>View your order history</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/checkout/address")}
        >
          🏠 Address
          <span>Edit delivery details</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/replacement")}
        >
          🔁 Replacement
          <span>Request replacement</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/wishlist")}
        >
          ⭐ Wishlist
          <span>Saved products</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/rewards")}
        >
          🎁 Rewards
          <span>Your reward points</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/policies")}
        >
          📄 Policies
          <span>Privacy, refund & warranty</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/about-us")}
        >
          ℹ️ About Us
          <span>Know LapkingHub</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/contact")}
        >
          📞 Contact Us
          <span>Support & help</span>
        </div>

        {/* ADMIN ACCESS */}
        {profile?.role === "admin" && (
          <div
            className="account-item admin"
            onClick={() => navigate("/admin")}
          >
            🛠 Admin Panel
            <span>Manage store</span>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
