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

      if (!user) {
        localStorage.setItem("redirect_after_login", "/account");
        navigate("/login");
        return;
      }

      setUser(user);

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

  // ✅ ADMIN EMAIL (ONLY THIS EMAIL)
  const isAdmin =
    user?.email === "pahadsinghdeora23@gmail.com";

  // ===============================
  // UI
  // ===============================
  return (
    <div className="account-page">

      {/* PROFILE HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>

        <h3>{profile?.full_name || "Customer"}</h3>
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
          📦 Orders
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/checkout/address")}
        >
          🏠 Address
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/replacement")}
        >
          🔁 Replacement
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/wishlist")}
        >
          ⭐ Wishlist
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/rewards")}
        >
          🎁 Rewards
        </div>

        {/* ✅ ADMIN ONLY FOR THIS EMAIL */}
        {isAdmin && (
          <div
            className="account-item admin"
            onClick={() => navigate("/admin")}
          >
            🛠 Admin
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
