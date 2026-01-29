// src/pages/CheckoutAddress.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutAddress.css";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  // ✅ LOGIN CHECK
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.loggedIn) {
      // 🔁 after login return here
      localStorage.setItem(
        "redirect_after_login",
        "/checkout/address"
      );

      navigate("/login");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    business_name: "",
    gst: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // 🔁 HANDLE CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SUBMIT
  const handleContinue = () => {
    if (
      !form.business_name ||
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    // 🔐 SAVE ADDRESS
    localStorage.setItem(
      "checkout_address",
      JSON.stringify(form)
    );

    navigate("/checkout/shipping");
  };

  return (
    <div className="checkout-address">
      <div className="address-card">

        <h2>📦 Delivery Address</h2>
        <p className="sub-text">
          Please enter your delivery details
        </p>

        <label>Business Name *</label>
        <input
          type="text"
          name="business_name"
          value={form.business_name}
          onChange={handleChange}
        />

        <label>GST Number (optional)</label>
        <input
          type="text"
          name="gst"
          value={form.gst}
          onChange={handleChange}
        />

        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label>Mobile Number *</label>
        <div className="mobile-box">
          <span>+91</span>
          <input
            type="tel"
            name="phone"
            maxLength="10"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <label>Shop Address *</label>
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
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Pincode *</label>
        <input
          type="number"
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
        />

        <button
          className="continue-btn"
          onClick={handleContinue}
        >
          Continue to Shipping →
        </button>

        <p className="safe-text">
          🔒 Your information is safe and used only for delivery
        </p>

      </div>
    </div>
  );
}
