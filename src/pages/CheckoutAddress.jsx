// src/pages/CheckoutAddress.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutAddress.css";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    model: "",
    part: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleContinue = () => {
    if (
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

    localStorage.setItem(
      "checkout_address",
      JSON.stringify(form)
    );

    navigate("/checkout/shipping");
  };

  return (
    <div className="checkout-page">

      <div className="checkout-card">

        <h2>📦 Delivery Address</h2>
        <p className="subtitle">
          Please enter your delivery details
        </p>

        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Mobile Number *</label>
          <div className="mobile-row">
            <span>+91</span>
            <input
              type="tel"
              name="phone"
              maxLength="10"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Full Address *</label>
          <textarea
            name="address"
            rows="3"
            value={form.address}
            onChange={handleChange}
            placeholder="House no, street, area, landmark"
          />
        </div>

        <div className="two-col">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pincode *</label>
          <input
            type="tel"
            name="pincode"
            maxLength="6"
            value={form.pincode}
            onChange={handleChange}
            placeholder="6 digit pincode"
          />
        </div>

        <hr />

        <div className="form-group">
          <label>Laptop Model (optional)</label>
          <input
            type="text"
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="Eg: Dell Inspiron"
          />
        </div>

        <div className="form-group">
          <label>Part Number (optional)</label>
          <input
            type="text"
            name="part"
            value={form.part}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <button
          className="continue-btn"
          onClick={handleContinue}
        >
          Continue to Shipping →
        </button>

        <div className="secure-text">
          🔒 Your information is safe & used only for delivery
        </div>

      </div>
    </div>
  );
}
