import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CheckoutShipping() {

  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);

  const subtotal = 2550; // later cart se aayega

  // ================= LOAD COURIERS FROM ADMIN =================
  useEffect(() => {
    const loadCouriers = async () => {
      const { data, error } = await supabase
        .from("couriers")
        .select("*")
        .eq("status", true)
        .order("price", { ascending: true });

      if (!error && data?.length > 0) {
        setCouriers(data);
        setSelectedCourier(data[0]); // default select
      }
    };

    loadCouriers();
  }, []);

  const shipping = selectedCourier?.price || 0;
  const total = subtotal + shipping;

  return (
    <div className="checkout-container">

      {/* ================= ORDER SUMMARY ================= */}
      <div className="card">
        <h3>Order Summary</h3>

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
        <label>Please enter your Model & Part Number</label>

        <input
          type="text"
          placeholder="e.g. Dell Latitude 7400 / 0CMX1D"
        />

        <small>
          To avoid your product being wrongly delivered
        </small>
      </div>

      {/* ================= COURIER ================= */}
      <div className="card">
        <h3>Select Courier</h3>

        {couriers.map((item) => (
          <div
            key={item.id}
            className={`courier-box ${
              selectedCourier?.id === item.id ? "active" : ""
            }`}
            onClick={() => setSelectedCourier(item)}
          >
            <input
              type="radio"
              checked={selectedCourier?.id === item.id}
              readOnly
            />

            <div>
              <b>{item.name}</b>
              <p>{item.days}</p>
            </div>

            <span>₹{item.price}</span>
          </div>
        ))}
      </div>

      {/* ================= CONTINUE ================= */}
      <button
        className="primary-btn"
        disabled={!selectedCourier}
        onClick={() => {
          window.location.hash = "#/checkout/payment";
        }}
      >
        Continue to Payment →
      </button>

    </div>
  );
}
