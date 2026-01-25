// src/pages/CheckoutAddress.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutAddress.css";

export default function CheckoutAddress() {
  const navigate = useNavigate();

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

        {/* BUSINESS NAME */}
        <label>Business Name *</label>
        <input
          type="text"
          name="business_name"
          placeholder="Enter business / shop name"
          value={form.business_name}
          onChange={handleChange}
        />

        {/* GST */}
        <label>GST Number (optional)</label>
        <input
          type="text"
          name="gst"
          placeholder="Enter GST number"
          value={form.gst}
          onChange={handleChange}
        />

        {/* FULL NAME */}
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          value={form.name}
          onChange={handleChange}
        />

        {/* MOBILE */}
        <label>Mobile Number *</label>
        <div className="mobile-box">
          <span>+91</span>
          <input
            type="tel"
            name="phone"
            maxLength="10"
            placeholder="Enter mobile number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* ADDRESS */}
        <label>Shop Address *</label>
        <textarea
          name="address"
          rows="3"
          placeholder="Enter your shop address"
          value={form.address}
          onChange={handleChange}
        />

        {/* CITY + STATE */}
        <div className="row">
          <div>
            <label>City *</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>State *</label>
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* PINCODE */}
        <label>Pincode *</label>
        <input
          type="number"
          name="pincode"
          placeholder="6 digit pincode"
          value={form.pincode}
          onChange={handleChange}
        />

        {/* BUTTON */}
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
