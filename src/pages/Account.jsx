// src/pages/Account.jsx

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔐 AUTH LISTENER
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      // ✅ fetch user profile
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        alert("Profile load error: " + error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ⏳ loading
  if (loading) {
    return <p style={{ padding: 20 }}>Loading account...</p>;
  }

  // ❌ NOT LOGGED IN → FORCE LOGIN
  if (!user) {
    localStorage.setItem("redirect_after_login", "/account");
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="account-page">

      {/* PROFILE HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>

        <h3>Welcome to LapkingHub</h3>
        <p>{user.email}</p>
      </div>

      {/* USER DETAILS */}
      {profile && (
        <div style={{ padding: 15 }}>
          <p>✅ Login persistent</p>
          <p>✅ Reload safe</p>
          <p>✅ Supabase session active</p>

          <hr />

          <p><b>Name:</b> {profile.full_name || "-"}</p>
          <p><b>Mobile:</b> {profile.mobile || "-"}</p>
          <p><b>City:</b> {profile.city || "-"}</p>
          <p><b>Pincode:</b> {profile.pincode || "-"}</p>
        </div>
      )}

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}
