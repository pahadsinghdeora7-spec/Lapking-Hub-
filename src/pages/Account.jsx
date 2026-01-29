import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("orders");
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    full_name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔐 LOAD SESSION
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        setLoading(false);
        return;
      }

      setUser(data.user);

      const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        alert("Profile load error");
      }

      if (profileData) {
        setProfile(profileData);
        setAddress({
          full_name: profileData.full_name || "",
          mobile: profileData.mobile || "",
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          pincode: profileData.pincode || "",
        });
      }

      setLoading(false);
    } catch (err) {
      alert("Account error");
      setLoading(false);
    }
  };

  // 💾 SAVE ADDRESS
  const saveAddress = async () => {
    if (!user) return alert("Login required");

    const { error } = await supabase.from("user_profiles").upsert({
      user_id: user.id,
      ...address,
    });

    if (error) {
      alert("Address save failed");
    } else {
      alert("Address saved successfully");
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <p style={{ padding: 20 }}>Loading account...</p>;

  if (!user)
    return (
      <p style={{ padding: 20 }}>
        Please login to continue
      </p>
    );

  return (
    <div className="account-page">

      {/* PROFILE HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>Wholesale Laptop Accessories</p>
        <small>{user.email}</small>
      </div>

      {/* TABS */}
      <div className="account-tabs">
        <button onClick={() => setTab("orders")}>📦 Orders</button>
        <button onClick={() => setTab("address")}>📍 Address</button>
        <button onClick={() => setTab("replacement")}>🔁 Replacement</button>
        <button onClick={() => setTab("wishlist")}>❤️ Wishlist</button>
        <button onClick={() => setTab("rewards")}>🎁 Rewards</button>
        <button onClick={() => setTab("policies")}>📄 Policies</button>
        <button onClick={() => setTab("contact")}>☎ Contact</button>
        <button onClick={() => navigate("/admin")}>🛠 Admin</button>
      </div>

      {/* CONTENT */}
      <div className="account-content">

        {tab === "orders" && (
          <p>Your orders will appear here.</p>
        )}

        {tab === "address" && (
          <div>
            <h4>Delivery Address</h4>

            <input placeholder="Full Name"
              value={address.full_name}
              onChange={e => setAddress({ ...address, full_name: e.target.value })}
            />

            <input placeholder="Mobile"
              value={address.mobile}
              onChange={e => setAddress({ ...address, mobile: e.target.value })}
            />

            <input placeholder="Address"
              value={address.address}
              onChange={e => setAddress({ ...address, address: e.target.value })}
            />

            <input placeholder="City"
              value={address.city}
              onChange={e => setAddress({ ...address, city: e.target.value })}
            />

            <input placeholder="State"
              value={address.state}
              onChange={e => setAddress({ ...address, state: e.target.value })}
            />

            <input placeholder="Pincode"
              value={address.pincode}
              onChange={e => setAddress({ ...address, pincode: e.target.value })}
            />

            <button onClick={saveAddress}>
              Save Address
            </button>
          </div>
        )}

        {tab === "replacement" && <p>Replacement requests here.</p>}
        {tab === "wishlist" && <p>Your wishlist items.</p>}
        {tab === "rewards" && <p>Rewards & offers.</p>}
        {tab === "policies" && <p>Company policies.</p>}
        {tab === "contact" && <p>Contact support.</p>}
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </div>
  );
}
