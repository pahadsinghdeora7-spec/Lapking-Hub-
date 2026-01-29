// src/pages/CheckoutAddress.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./CheckoutAddress.css";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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

  // 🔐 LOGIN CHECK + AUTO FILL
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        localStorage.setItem(
          "redirect_after_login",
          "/checkout/address"
        );
        navigate("/login");
        return;
      }

      // ✅ fetch user profile
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

    loadProfile();
  }, [navigate]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleContinue() {
    if (
      !form.full_name ||
      !form.mobile ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required delivery details");
      return;
    }

    localStorage.setItem(
      "checkout_address",
      JSON.stringify(form)
    );

    navigate("/checkout/shipping");
  }

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading address…</p>;
  }

  return (
    <div className="checkout-address">

      <div className="address-card">

        <h2>📦 Delivery Address</h2>

        <p className="trust-text">
          Please confirm your delivery details to ensure smooth shipment.
        </p>

        <div className="info-box">
          ✔ Verified account <br />
          ✔ Secure delivery <br />
          ✔ Business order support
        </div>

        <label>Full Name *</label>
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
        />

        <label>Mobile Number *</label>
        <div className="mobile-box">
          <span>+91</span>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
          />
        </div>

        <label>Business Name (optional)</label>
        <input
          name="business_name"
          value={form.business_name}
          onChange={handleChange}
        />

        <label>GST Number (optional)</label>
        <input
          name="gst_number"
          value={form.gst_number}
          onChange={handleChange}
        />

        <label>Complete Address *</label>
        <textarea
          name="address"
          rows="3"
          value={form.address}
          onChange={handleChange}
        />

        <div className="row">
          <div>
            <label>City *</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>State *</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Pincode *</label>
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
        />

        <button className="continue-btn" onClick={handleContinue}>
          Continue to Shipping →
        </button>

        <p className="safe-text">
          🔒 Your address is used only for order delivery.
        </p>

      </div>
    </div>
  );
}
