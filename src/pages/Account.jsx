import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function Account() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // 🔹 LOAD PROFILE AFTER LOGIN
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login again");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        alert("Profile load error");
        return;
      }

      if (data) {
        setForm({
          full_name: data.full_name || "",
          mobile: data.mobile || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || ""
        });
      }

    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  }

  // 🔹 SAVE / UPDATE ADDRESS
  async function saveAddress() {
    if (!user) return;

    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        ...form
      });

    if (error) {
      alert("Save failed");
    } else {
      alert("Address saved successfully ✅");
    }
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading account...</p>;
  }

  return (
    <div className="account-page">

      <div className="account-profile">
        <div className="avatar">👤</div>
        <h3>Welcome to LapkingHub</h3>
        <p>{user.email}</p>
      </div>

      <h4>📍 Delivery Address</h4>

      <div className="address-form">
        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
        />

        <input
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={(e) =>
            setForm({ ...form, mobile: e.target.value })
          }
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <input
          placeholder="State"
          value={form.state}
          onChange={(e) =>
            setForm({ ...form, state: e.target.value })
          }
        />

        <input
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) =>
            setForm({ ...form, pincode: e.target.value })
          }
        />

        <button onClick={saveAddress}>
          Save Address
        </button>
      </div>

      <button
        className="logout-btn"
        onClick={() => supabase.auth.signOut()}
      >
        Logout
      </button>

    </div>
  );
}
