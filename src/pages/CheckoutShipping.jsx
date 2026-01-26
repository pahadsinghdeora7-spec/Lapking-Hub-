import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CheckoutShipping() {

  // ================= STATES =================
  const [cart, setCart] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);

  // ================= LOAD CART =================
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // ================= LOAD COURIERS =================
  useEffect(() => {
    const loadCouriers = async () => {
      const { data, error } = await supabase
        .from("couriers")
        .select("*")
        .eq("status", true)
        .order("price", { ascending: true });

      if (!error && data.length > 0) {
        setCouriers(data);
        setSelectedCourier(data[0]); // default select
      }
    };

    loadCouriers();
  }, []);

  // ================= CALCULATIONS =================
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = selectedCourier ? selectedCourier.price : 0;
  const total = subtotal + shipping;

  // ================= UI =================
  return (
    <div className="checkout-container">

      {/* ================= STEPS ================= */}
      <div className="checkout-steps">
        <span className="done">✔ Address</span>
        <span className="active">🚚 Shipping</span>
        <span>💳 Payment</span>
      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="card">
        <h3>📋 Order Summary</h3>

        {cart.map((item, i) => (
          <div key={i} className="summary-item">
            <span>{item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr />

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

      {/* ================= MODEL PART ================= */}
      <div className="card">
        <label>🧾 Model & Part Number</label>
        <input placeholder="e.g. Dell Latitude 7400 / 0CMX1D" />
        <small>Helps us deliver correct spare part</small>
      </div>

      {/* ================= COURIERS ================= */}
      <div className="card">
        <h3>🚚 Select Courier</h3>

        {couriers.map((c) => (
          <div
            key={c.id}
            className={`courier-box ${
              selectedCourier?.id === c.id ? "active" : ""
            }`}
            onClick={() => setSelectedCourier(c)}
          >
            <input
              type="radio"
              checked={selectedCourier?.id === c.id}
              readOnly
            />

            <div>
              <b>{c.name}</b>
              <p>{c.days}</p>
            </div>

            <span>₹{c.price}</span>
          </div>
        ))}

        <small className="courier-note">
          Courier & price managed from admin panel
        </small>
      </div>

      {/* ================= BUTTON ================= */}
      <button
        className="primary-btn"
        onClick={() => {
          localStorage.setItem(
            "selectedCourier",
            JSON.stringify(selectedCourier)
          );
          window.location.hash = "#/checkout/payment";
        }}
      >
        Continue to Payment →
      </button>

    </div>
  );
            }
