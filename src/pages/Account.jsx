import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // 🔐 LOAD USER + PROFILE
  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      setUser(user);

      // 🔥 PROFILE FETCH
      let { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // 🔥 CREATE PROFILE IF NOT EXISTS
      if (!profileData) {
        const { data: newProfile, error } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            email: user.email,
          })
          .select()
          .single();

        if (error) throw error;

        profileData = newProfile;
      }

      setProfile(profileData);
      setForm({
        full_name: profileData.full_name || "",
        mobile: profileData.mobile || "",
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        pincode: profileData.pincode || "",
      });

    } catch (err) {
      alert("Account load error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // 💾 SAVE ADDRESS
  async function saveAddress() {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(form)
        .eq("user_id", user.id);

      if (error) throw error;

      alert("Address saved successfully ✅");
      loadAccount();

    } catch (err) {
      alert("Save error: " + err.message);
    }
  }

  // 🚪 LOGOUT
  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading account...</div>;
  }

  return (
    <div className="account-page">

      {/* PROFILE HEADER */}
      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>Wholesale Laptop Accessories</p>
        <small>{profile?.email}</small>
      </div>

      {/* TABS */}
      <div className="account-tabs">
        <button>📦 My Orders</button>
        <button>📍 Address</button>
        <button>🔁 Replacement</button>
        <button>❤️ Wishlist</button>
        <button>🎁 Rewards</button>
        <button>📄 Policies</button>
        <button>☎ Contact</button>
        <button onClick={() => navigate("/admin")}>🛠 Admin</button>
      </div>

      {/* ADDRESS */}
      <div className="address-box">
        <h4>📍 Delivery Address</h4>
        <p style={{ fontSize: 13, color: "#666" }}>
          This address will be used for order delivery and invoices.
        </p>

        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />

        <input
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />

        <input
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />

        <button className="save-btn" onClick={saveAddress}>
          Save Address
        </button>
      </div>

      {/* LOGOUT */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
