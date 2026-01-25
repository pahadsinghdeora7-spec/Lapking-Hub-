// src/pages/CheckoutAddress.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


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
    part: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      alert("Please fill required fields");
      return;
    }

    localStorage.setItem("checkout_address", JSON.stringify(form));
    navigate("/order/success");
  };

  return (
    <div className="checkout-address">

      <h2>Delivery Address</h2>

      <div className="address-box">

        <input
          type="text"
          name="model"
          placeholder="Laptop Model (optional)"
          value={form.model}
          onChange={handleChange}
        />

        <input
          type="text"
          name="part"
          placeholder="Part Number (optional)"
          value={form.part}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number *"
          value={form.phone}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Full Address *"
          value={form.address}
          onChange={handleChange}
        />

        <div className="row">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="pincode"
          placeholder="Pincode *"
          value={form.pincode}
          onChange={handleChange}
        />

        <button onClick={handleContinue}>
          Continue to Shipping →
        </button>

      </div>
    </div>
  );
      }
