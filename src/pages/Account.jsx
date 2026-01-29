import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOAD USER PROFILE
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile error:", profileError);
    }

    setProfile(data);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading your account...</p>;
  }

  return (
    <div className="account-page">

      {/* HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>Wholesale Laptop Accessories</p>
      </div>

      {/* TABS */}
      <div className="account-tabs">
        <button onClick={() => setActiveTab("orders")}>📦 My Orders</button>
        <button onClick={() => setActiveTab("address")}>📍 Address</button>
        <button onClick={() => setActiveTab("replacement")}>🔁 Replacement</button>
        <button onClick={() => setActiveTab("profile")}>👤 Profile</button>
        <button
          onClick={() => navigate("/admin")}
          style={{ color: "#0d6efd", fontWeight: 600 }}
        >
          🛠 Admin Panel
        </button>
      </div>

      {/* CONTENT */}
      <div className="account-content">

        {/* ORDERS */}
        {activeTab === "orders" && (
          <>
            <h4>📦 My Orders</h4>
            <p>Your orders will appear here after purchase.</p>
          </>
        )}

        {/* ADDRESS */}
        {activeTab === "address" && (
          <>
            <h4>📍 Delivery Address</h4>

            {!profile ? (
              <p>No address saved yet.</p>
            ) : (
              <div className="address-box">
                <p><b>Name:</b> {profile.full_name}</p>
                <p><b>Mobile:</b> {profile.mobile}</p>
                <p><b>Address:</b> {profile.address}</p>
                <p><b>City:</b> {profile.city}</p>
                <p><b>State:</b> {profile.state}</p>
                <p><b>Pincode:</b> {profile.pincode}</p>
              </div>
            )}
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <>
            <h4>👤 My Profile</h4>

            {!profile ? (
              <p>Profile not completed yet.</p>
            ) : (
              <div className="profile-box">
                <p><b>Full Name:</b> {profile.full_name}</p>
                <p><b>Email:</b> {profile.email}</p>
                <p><b>Mobile:</b> {profile.mobile}</p>
                <p><b>Business:</b> {profile.business_name || "—"}</p>
                <p><b>GST:</b> {profile.gst_number || "—"}</p>
              </div>
            )}
          </>
        )}

        {/* REPLACEMENT */}
        {activeTab === "replacement" && (
          <>
            <h4>🔁 Replacement</h4>
            <p>
              If product damaged or wrong item received,
              you can request replacement from here.
            </p>
          </>
        )}

      </div>

      {/* LOGOUT */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </div>
  );
                  }
