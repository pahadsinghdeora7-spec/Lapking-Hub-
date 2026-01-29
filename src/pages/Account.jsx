import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {

  const navigate = useNavigate();

  const [tab, setTab] = useState("details");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    mobile: "",
    business_name: "",
    gst_number: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [orders, setOrders] = useState([]);

  // ===============================
  // LOAD USER DATA
  // ===============================
  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  async function loadProfile() {
    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      if (error) {
        alert("Profile load error: " + error.message);
        return;
      }

      if (data) setProfile(data);

    } catch (err) {
      alert("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      const { data: authData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        alert("Orders load error: " + error.message);
        return;
      }

      setOrders(data || []);
    } catch (err) {
      alert("Order error: " + err.message);
    }
  }

  // ===============================
  // SAVE PROFILE
  // ===============================
  async function saveProfile() {
    try {
      const { data: authData } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: authData.user.id,
          ...profile
        });

      if (error) {
        alert("Save failed: " + error.message);
        return;
      }

      alert("✅ Address & profile saved successfully");

    } catch (err) {
      alert("Save error: " + err.message);
    }
  }

  // ===============================
  // LOGOUT
  // ===============================
  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  // ===============================
  // UI
  // ===============================
  if (loading) return <p style={{ padding: 20 }}>Loading account...</p>;

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
        <button onClick={() => setTab("details")}>👤 Account</button>
        <button onClick={() => setTab("orders")}>📦 Orders</button>
        <button onClick={() => setTab("return")}>🔁 Return</button>
        <button onClick={() => setTab("wishlist")}>⭐ Watchlist</button>
        <button onClick={() => setTab("rewards")}>🎁 Rewards</button>
        <button onClick={() => setTab("policies")}>📄 Policies</button>
        <button onClick={() => setTab("about")}>ℹ About</button>
        <button onClick={() => setTab("contact")}>📞 Contact</button>
        <button onClick={() => navigate("/admin")}>🛠 Admin</button>
      </div>

      {/* CONTENT */}
      <div className="account-content">

        {/* ACCOUNT DETAILS */}
        {tab === "details" && (
          <>
            <h4>Delivery Address</h4>

            <input placeholder="Full Name" value={profile.full_name}
              onChange={e => setProfile({ ...profile, full_name: e.target.value })} />

            <input placeholder="Mobile" value={profile.mobile}
              onChange={e => setProfile({ ...profile, mobile: e.target.value })} />

            <input placeholder="Business Name" value={profile.business_name}
              onChange={e => setProfile({ ...profile, business_name: e.target.value })} />

            <input placeholder="GST Number" value={profile.gst_number}
              onChange={e => setProfile({ ...profile, gst_number: e.target.value })} />

            <input placeholder="Address" value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })} />

            <input placeholder="City" value={profile.city}
              onChange={e => setProfile({ ...profile, city: e.target.value })} />

            <input placeholder="State" value={profile.state}
              onChange={e => setProfile({ ...profile, state: e.target.value })} />

            <input placeholder="Pincode" value={profile.pincode}
              onChange={e => setProfile({ ...profile, pincode: e.target.value })} />

            <button onClick={saveProfile}>💾 Save Address</button>
          </>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <>
            <h4>My Orders</h4>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map(o => (
                <div key={o.id} className="order-box">
                  <p><b>Order ID:</b> {o.id}</p>
                  <p>Status: {o.status}</p>
                  <p>Total: ₹{o.total}</p>
                </div>
              ))
            )}
          </>
        )}

        {tab === "return" && <p>Return / Replacement coming soon</p>}
        {tab === "wishlist" && <p>Your saved products will appear here</p>}
        {tab === "rewards" && <p>Reward points coming soon</p>}
        {tab === "policies" && <p>All store policies shown here</p>}
        {tab === "about" && <p>LapkingHub – Trusted wholesale laptop accessories supplier.</p>}
        {tab === "contact" && <p>📞 Support: 9873670361</p>}

      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </div>
  );
      }
