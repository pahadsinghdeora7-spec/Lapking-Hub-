import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // 🔐 get logged user
  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setProfile(data);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) return <p style={{ padding: 20 }}>Loading account...</p>;

  return (
    <div className="account-page">

      {/* PROFILE HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>Wholesale Laptop Accessories</p>
      </div>

      {/* TABS */}
      <div className="account-tabs">

        <button onClick={() => setTab("orders")} className="menu-item">
          📦 My Orders
        </button>

        <button onClick={() => setTab("address")} className="menu-item">
          📍 Address
        </button>

        <button onClick={() => setTab("replacement")} className="menu-item">
          🔁 Replacement
        </button>

        <button onClick={() => setTab("profile")} className="menu-item">
          👤 Profile
        </button>

        <button
          className="menu-item"
          onClick={() => navigate("/admin")}
          style={{ color: "#0d6efd", fontWeight: "600" }}
        >
          🛠 Admin Panel
        </button>

      </div>

      {/* CONTENT */}
      <div className="account-content">

        {/* ORDERS */}
        {tab === "orders" && (
          <>
            <h4>📦 My Orders</h4>
            <p>Your all orders will appear here.</p>
          </>
        )}

        {/* ADDRESS */}
        {tab === "address" && (
          <>
            <h4>📍 Delivery Address</h4>

            <p style={{ color: "#666", fontSize: 14 }}>
              This address will be used for all deliveries.
            </p>

            <div className="address-box">
              <p><b>Name:</b> {profile.full_name}</p>
              <p><b>Mobile:</b> {profile.mobile}</p>
              <p><b>Address:</b> {profile.address}</p>
              <p><b>City:</b> {profile.city}</p>
              <p><b>State:</b> {profile.state}</p>
              <p><b>Pincode:</b> {profile.pincode}</p>
            </div>
          </>
        )}

        {/* REPLACEMENT */}
        {tab === "replacement" && (
          <>
            <h4>🔁 Replacement Requests</h4>
            <p>
              If product damaged or wrong item received,
              you can request replacement here.
            </p>
          </>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <>
            <h4>👤 My Profile</h4>

            <div className="profile-box">
              <p><b>Full Name:</b> {profile.full_name}</p>
              <p><b>Email:</b> {profile.email}</p>
              <p><b>Mobile:</b> {profile.mobile}</p>
              <p><b>Business:</b> {profile.business_name || "—"}</p>
              <p><b>GST:</b> {profile.gst_number || "—"}</p>
            </div>
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
