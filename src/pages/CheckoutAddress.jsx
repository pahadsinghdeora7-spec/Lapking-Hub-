import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutAddress.css";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const userMobile = localStorage.getItem("user_mobile");

    if (!userMobile) {
      localStorage.setItem(
        "redirect_after_login",
        "checkout/address"
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

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

        <label>Business Name *</label>
        <input
          name="business_name"
          value={form.business_name}
          onChange={handleChange}
        />

        <label>GST (optional)</label>
        <input
          name="gst"
          value={form.gst}
          onChange={handleChange}
        />

        <label>Full Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label>Mobile *</label>
        <div className="mobile-box">
          <span>+91</span>
          <input
            name="phone"
            maxLength="10"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <label>Address *</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <div className="row">
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />
        </div>

        <label>Pincode *</label>
        <input
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

      </div>
    </div>
  );
}
