import React, { useState } from "react";
import "./CheckoutShipping.css";

export default function CheckoutShipping() {

  const [courier, setCourier] = useState("bluedart");

  return (
    <div className="checkout-wrapper">

      <div className="checkout-container">

        {/* STEP INDICATOR */}
        <div className="checkout-steps">
          ✔ Address → 🚚 Shipping → 💳 Payment
        </div>

        {/* ORDER SUMMARY */}
        <div className="card">
          <h3>📦 Order Summary</h3>

          <div className="summary-row">
            <span>Keyboard × 1</span>
            <span>₹500</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹500</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {courier === "bluedart" && "₹149"}
              {courier === "dtdc" && "₹79"}
              {courier === "delhivery" && "₹99"}
            </span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>
              ₹
              {courier === "bluedart"
                ? 649
                : courier === "dtdc"
                ? 579
                : 599}
            </span>
          </div>
        </div>

        {/* MODEL PART */}
        <div className="card">
          <label>🧩 Model & Part Number</label>

          <input
            type="text"
            placeholder="e.g. Dell Latitude 7400 / 0CMX1D"
          />

          <small>
            Helps us deliver correct spare part
          </small>
        </div>

        {/* COURIER */}
        <div className="card">
          <h3>🚚 Select Courier</h3>
          <small className="muted">
            Courier & price managed from admin panel
          </small>

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
        </div>

        {/* BUTTON */}
        <button
          className="primary-btn"
          onClick={() => {
            window.location.hash = "#/checkout/payment";
          }}
        >
          Continue to Payment →
        </button>

      </div>
    </div>
  );
}
