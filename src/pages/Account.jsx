import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const [tab, setTab] = useState("orders");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const isAdmin = true;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setProfile(profileData);

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setOrders(orderData || []);

    const { data: wishlistData } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id);

    setWishlist(wishlistData || []);
  }

  return (
    <div className="account-layout">

      {/* LEFT MENU */}
      <div className="account-sidebar">

        <div className="profile-box">
          👤
          <h4>{profile?.full_name || "LapkingHub User"}</h4>
          <p>Wholesale Buyer Account</p>
        </div>

        <div onClick={() => setTab("orders")} className="menu-item">📦 My Orders</div>
        <div onClick={() => setTab("address")} className="menu-item">📍 Address</div>
        <div onClick={() => setTab("replacement")} className="menu-item">🔁 Replacement</div>
        <div onClick={() => setTab("wishlist")} className="menu-item">⭐ Wishlist</div>
        <div onClick={() => setTab("policies")} className="menu-item">📄 Policies</div>
        <div onClick={() => setTab("about")} className="menu-item">ℹ️ About Us</div>
        <div onClick={() => setTab("contact")} className="menu-item">☎️ Contact Us</div>

        {isAdmin && (
          <div onClick={() => window.location.href="/admin"} className="menu-item admin">
            🛠 Admin Panel
          </div>
        )}

      </div>

      {/* RIGHT CONTENT */}
      <div className="account-content">

        {/* ORDERS */}
        {tab === "orders" && (
          <>
            <h3>My Orders</h3>
            <p>Track your wholesale orders easily.</p>

            {orders.length === 0 && <p>No orders found.</p>}

            {orders.map(o => (
              <div key={o.id} className="card">
                <b>Order ID:</b> #{o.id}<br/>
                <b>Total:</b> ₹{o.total_amount}<br/>
                <b>Status:</b> {o.status}
              </div>
            ))}
          </>
        )}

        {/* ADDRESS */}
        {tab === "address" && profile && (
          <>
            <h3>Delivery Address</h3>
            <p>Your saved delivery location.</p>

            <div className="card">
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
            <h3>Replacement Requests</h3>
            <p>Request replacement for damaged or wrong items.</p>

            {orders.map(o => (
              <div key={o.id} className="card">
                Order #{o.id}
                <button style={{marginTop:10}}>
                  Request Replacement
                </button>
              </div>
            ))}
          </>
        )}

        {/* WISHLIST */}
        {tab === "wishlist" && (
          <>
            <h3>Wishlist</h3>
            <p>Your saved products for future purchase.</p>

            {wishlist.length === 0 && <p>No items in wishlist.</p>}
          </>
        )}

        {/* POLICIES */}
        {tab === "policies" && (
          <>
            <h3>Policies</h3>
            <p>Return • Replacement • Shipping • Privacy</p>

            <div className="card">
              Replacement allowed within 7 days for genuine issues.
            </div>
          </>
        )}

        {/* ABOUT */}
        {tab === "about" && (
          <>
            <h3>About LapkingHub</h3>
            <p>
              LapkingHub is a wholesale platform for laptop and computer
              accessories across India.
            </p>
          </>
        )}

        {/* CONTACT */}
        {tab === "contact" && (
          <>
            <h3>Contact Us</h3>
            <p>📞 WhatsApp: 9873670361</p>
            <p>📧 Support: lapkinghub@gmail.com</p>
          </>
        )}

      </div>
    </div>
  );
      }
