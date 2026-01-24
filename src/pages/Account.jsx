// ===================================================
// 🔒 ACCOUNT PAGE – FULL SAFE VERSION
// Base44 style UI
// Logic SAFE | UI improved only
// ===================================================

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./account.css";

export default function Account() {
  // ===================================================
  // 🔒 EXISTING LOGIC (DO NOT TOUCH)
  // ===================================================
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
    } else {
      setUser(user);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user) return null;

  // ===================================================
  // 🎨 BASE44 UI START
  // ===================================================

  return (
    <div className="account-page">

      {/* ================= PROFILE HEADER ================= */}
      <div className="account-header">
        <div className="avatar">👤</div>
        <div>
          <h3>{user.user_metadata?.full_name || "User"}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="account-tabs">
        <button className="active">Profile</button>
        <button>Addresses</button>
        <button>Returns</button>
      </div>

      {/* ================= PROFILE INFO ================= */}
      <div className="account-card">
        <div className="card-title">
          <h4>Profile Information</h4>
        </div>

        <div className="info-grid">
          <div>
            <label>Full Name</label>
            <p>{user.user_metadata?.full_name || "-"}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div>
            <label>Business Name</label>
            <p>-</p>
          </div>

          <div>
            <label>Phone</label>
            <p>-</p>
          </div>
        </div>
      </div>

      {/* ================= MENU LIST ================= */}
      <div className="account-list">

        <div onClick={() => navigate("/orders")}>
          📦 My Orders
        </div>

        <div onClick={() => navigate("/replacement-request")}>
          🔄 Returns & Cancellations
        </div>

        <div onClick={() => navigate("/admin")}>
          🛠 Admin Dashboard
        </div>

      </div>

      {/* ================= LOGOUT ================= */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </div>
  );
      }
