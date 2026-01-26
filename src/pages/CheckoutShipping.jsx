import React, { useState } from "react";

export default function CheckoutShipping() {

  // ===== TEMP CART DATA (later cart se auto aayega) =====
  const subtotal = 500;

  // ===== COURIER STATE =====
  const [courier, setCourier] = useState("bluedart");

  // ===== SHIPPING PRICE SAFE FUNCTION =====
  const getShippingPrice = () => {
    if (courier === "bluedart") return 149;
    if (courier === "dtdc") return 79;
    if (courier === "delhivery") return 99;
    return 0;
  };

  const shipping = getShippingPrice();
  const total = subtotal + shipping;

  return (
    <div className="checkout-container">

      {/* ================= STEPS ================= */}
      <div className="checkout-steps">
        ✔ Address → 🚚 Shipping → 💳 Payment
      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="card">
        <h3>📦 Order Summary</h3>

        <div className="summary-row">
          <span>Keyboard × 1</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* ================= MODEL & PART ================= */}
      <div className="card">
        <label>🧩 Model & Part Number</label>

        <input
          type="text"
          placeholder="e.g. Dell Latitude 7400 / 0CMX1D"
        />

        <small>
          Helps us deliver the correct laptop spare part
        </small>
      </div>

      {/* ================= COURIER ================= */}
      <div className="card">
        <h3>🚚 Select Your Courier – Trusted Delivery Partners</h3>
        <p className="muted-text">
          Fast, secure & verified courier services
        </p>

        {/* BlueDart */}
        <div
          className={`courier-box ${courier === "bluedart" ? "active" : ""}`}
          onClick={() => setCourier("bluedart")}
        >
          <input type="radio" checked={courier === "bluedart"} readOnly />
          <div>
            <b>BlueDart</b>
            <p>2–4 working days</p>
          </div>
          <span>₹149</span>
        </div>

        {/* DTDC */}
        <div
          className={`courier-box ${courier === "dtdc" ? "active" : ""}`}
          onClick={() => setCourier("dtdc")}
        >
          <input type="radio" checked={courier === "dtdc"} readOnly />
          <div>
            <b>DTDC</b>
            <p>4–6 working days</p>
          </div>
          <span>₹79</span>
        </div>

        {/* Delhivery */}
        <div
          className={`courier-box ${courier === "delhivery" ? "active" : ""}`}
          onClick={() => setCourier("delhivery")}
        >
          <input type="radio" checked={courier === "delhivery"} readOnly />
          <div>
            <b>Delhivery</b>
            <p>3–5 working days</p>
          </div>
          <span>₹99</span>
        </div>

        <div className="safe-note">
          🔒 All parcels are securely packed before dispatch
        </div>
      </div>

      {/* ================= BUTTON ================= */}
      <button
        className="primary-btn"
        onClick={() => {
          window.location.hash = "#/checkout/payment";
        }}
      >
        Continue to Payment →
      </button>

    </div>
  );
}
