import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./account.css";

export default function AccountAddress() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    business_name: "",
    gst_number: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // 🔹 LOAD USER ADDRESS
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setForm({
        full_name: data.full_name || "",
        mobile: data.mobile || "",
        business_name: data.business_name || "",
        gst_number: data.gst_number || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || ""
      });
    }

    setLoading(false);
  }

  // 🔹 SAVE / UPDATE
  async function saveAddress() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("user_profiles").upsert({
      user_id: user.id,
      ...form
    });

    alert("Address saved successfully ✅");
    setEditing(false);
  }

  if (loading) return <p>Loading address...</p>;

  return (
    <div className="address-box">

      <h3>📍 Delivery Address</h3>
      <p className="muted">
        This address will be used for order delivery and invoices.
      </p>

      {!editing ? (
        <>
          {form.address ? (
            <div className="address-view">
              <p><b>{form.full_name}</b></p>
              <p>{form.mobile}</p>
              <p>{form.address}</p>
              <p>{form.city}, {form.state} - {form.pincode}</p>

              {form.business_name && (
                <p>🏢 {form.business_name}</p>
              )}

              {form.gst_number && (
                <p>GST: {form.gst_number}</p>
              )}
            </div>
          ) : (
            <p>No address saved yet.</p>
          )}

          <button onClick={() => setEditing(true)}>
            {form.address ? "Edit Address" : "Add Address"}
          </button>
        </>
      ) : (
        <>
          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />

          <input
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value })}
          />

          <input
            placeholder="Business Name (optional)"
            value={form.business_name}
            onChange={e => setForm({ ...form, business_name: e.target.value })}
          />

          <input
            placeholder="GST Number (optional)"
            value={form.gst_number}
            onChange={e => setForm({ ...form, gst_number: e.target.value })}
          />

          <textarea
            placeholder="Full Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
          />

          <input
            placeholder="State"
            value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })}
          />

          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={e => setForm({ ...form, pincode: e.target.value })}
          />

          <button onClick={saveAddress}>
            Save Address
          </button>
        </>
      )}
    </div>
  );
}
