import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  // TEMP ADMIN (baad me role se kar dena)
  const isAdmin = true;

  useEffect(() => {
    loadAccountData();
  }, []);

  async function loadAccountData() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    // PROFILE
    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setProfile(profileData);

    // ORDERS
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setOrders(orderData || []);
  }

  async function updateAddress() {
    await supabase
      .from("user_profiles")
      .update({
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode
      })
      .eq("user_id", profile.user_id);

    alert("Address updated successfully");
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="account-page">

      {/* PROFILE HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>
          Welcome {profile?.full_name || "to LapkingHub"}
        </h3>
        <p>Wholesale Laptop Accessories</p>
      </div>

      {/* TABS */}
      <div className="account-tabs">
        <button onClick={() => setTab("orders")}>My Orders</button>
        <button onClick={() => setTab("address")}>Address</button>
        <button onClick={() => setTab("replacement")}>Replacement</button>
        <button onClick={() => setTab("profile")}>Profile</button>
      </div>

      {/* CONTENT */}
      <div className="account-content">

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="card">
            <h3>My Orders</h3>

            {orders.length === 0 && (
              <p>No orders placed yet.</p>
            )}

            {orders.map((o) => (
              <div key={o.id} className="order-box">
                <b>Order ID:</b> #{o.id} <br />
                <b>Total:</b> ₹{o.total_amount} <br />
                <b>Status:</b> {o.status}
              </div>
            ))}
          </div>
        )}

        {/* ADDRESS */}
        {tab === "address" && profile && (
          <div className="card">
            <h3>Delivery Address</h3>

            <input value={profile.full_name || ""} disabled />
            <input value={profile.mobile || ""} disabled />

            <textarea
              placeholder="Full Address"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />

            <input
              placeholder="City"
              value={profile.city || ""}
              onChange={(e) =>
                setProfile({ ...profile, city: e.target.value })
              }
            />

            <input
              placeholder="State"
              value={profile.state || ""}
              onChange={(e) =>
                setProfile({ ...profile, state: e.target.value })
              }
            />

            <input
              placeholder="Pincode"
              value={profile.pincode || ""}
              onChange={(e) =>
                setProfile({ ...profile, pincode: e.target.value })
              }
            />

            <button onClick={updateAddress}>
              Update Address
            </button>
          </div>
        )}

        {/* REPLACEMENT */}
        {tab === "replacement" && (
          <div className="card">
            <h3>Replacement Request</h3>

            {orders.map((o) => (
              <div key={o.id} className="order-box">
                Order #{o.id}

                <button
                  onClick={async () => {
                    await supabase
                      .from("replacement_requests")
                      .insert({
                        order_id: o.id,
                        user_id: o.user_id,
                        status: "pending"
                      });

                    alert("Replacement request submitted");
                  }}
                >
                  Request Replacement
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && profile && (
          <div className="card">
            <h3>Account Details</h3>

            <p><b>Name:</b> {profile.full_name}</p>
            <p><b>Mobile:</b> {profile.mobile}</p>
            <p><b>Email:</b> {profile.email}</p>

            {profile.business_name && (
              <p><b>Business:</b> {profile.business_name}</p>
            )}

            {profile.gst_number && (
              <p><b>GST:</b> {profile.gst_number}</p>
            )}
          </div>
        )}
      </div>

      {/* ADMIN */}
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

      {/* LOGOUT */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </div>
  );
        }
