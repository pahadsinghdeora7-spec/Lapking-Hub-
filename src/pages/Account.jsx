// src/pages/Account.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "pahadsinghdeora23@gmail.com";

  useEffect(() => {
    let ignore = false;

    async function loadAccount() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (!ignore) {
        if (!error) setProfile(data || null);
        setLoading(false);
      }
    }

    loadAccount();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
      } else {
        setUser(session.user);
      }
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <p style={{ padding: 20, textAlign: "center" }}>
        Loading account...
      </p>
    );
  }

  // 🔐 Not logged in
  if (!user) {
    localStorage.setItem("redirect_after_login", "/account");
    return (
      <p style={{ padding: 20, textAlign: "center" }}>
        Please login to continue
      </p>
    );
  }

  return (
    <div className="account-page">

      {/* PROFILE */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Customer</h3>
        <p>{user.email}</p>
      </div>

      {/* USER DETAILS */}
      {profile && (
        <div className="account-details">
          {profile.full_name && (
            <p><b>Name:</b> {profile.full_name}</p>
          )}
          {profile.mobile && (
            <p><b>Mobile:</b> {profile.mobile}</p>
          )}
          {profile.city && (
            <p><b>City:</b> {profile.city}</p>
          )}
          {profile.pincode && (
            <p><b>Pincode:</b> {profile.pincode}</p>
          )}
        </div>
      )}

      {/* MENU */}
      <div className="account-menu">

        <div
          className="account-item"
          onClick={() => navigate("/orders")}
        >
          📦 Orders
          <span>View your order history</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/checkout/address")}
        >
          🏠 Manage Address
          <span>Edit delivery details</span>
        </div>

        <div
          className="account-item"
          onClick={() => navigate("/replacement")}
        >
          🔁 Replacement & Returns
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
          🎁 Rewards & Offers
          <span>Your rewards & coupons</span>
        </div>

        {/* 🔐 ADMIN — EMAIL BASED */}
        {user.email === ADMIN_EMAIL && (
          <div
            className="account-item admin"
            onClick={() => navigate("/admin")}
          >
            🛠 Admin Panel
            <span>Store management</span>
          </div>
        )}

      </div>

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={async () => {
          await supabase.auth.signOut();
          navigate("/");
        }}
      >
        Logout
      </button>

    </div>
  );
        }
