import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutAddress.css";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [checkingLogin, setCheckingLogin] = useState(true);

  // ✅ LOGIN CHECK — SAFE VERSION
  useEffect(() => {
    const userMobile = localStorage.getItem("user_mobile");

    if (!userMobile) {
      // 🔁 login ke baad yahi return kare
      localStorage.setItem(
        "redirect_after_login",
        "/checkout/address"
      );

      navigate("/login", { replace: true });
    } else {
      // ✅ user logged in
      setCheckingLogin(false);
    }
  }, [navigate]);

  // ⛔ jab tak login check ho raha hai
  if (checkingLogin) {
    return null;
  }

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
          value={form.business_name}
          onChange={handleChange}
        />

        {/* GST */}
        <label>GST Number (optional)</label>
        <input
          type="text"
          name="gst"
          value={form.gst}
          onChange={handleChange}
        />

        {/* FULL NAME */}
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
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
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* ADDRESS */}
        <label>Shop Address *</label>
        <textarea
          name="address"
          rows="3"
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

        {/* PINCODE */}
        <label>Pincode *</label>
        <input
          type="number"
          name="pincode"
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
