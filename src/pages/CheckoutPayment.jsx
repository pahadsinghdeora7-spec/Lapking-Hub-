// src/pages/CheckoutPayment.jsx

import React from "react";
import "./CheckoutPayment.css";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const checkout = JSON.parse(localStorage.getItem("checkout")) || {};

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = checkout.shipping_price || 79;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    // 1️⃣ insert order
    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          name: checkout.name,
          phone: checkout.phone,
          address: checkout.address,
          model_part: checkout.model_part || "",
          shipping_name: checkout.shipping_name,
          shipping_price: shipping,
          total: total,
          payment_method: "UPI",
          payment_status: "pending",
          order_status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Order failed");
      return;
    }

    // 2️⃣ insert order items
    const items = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }));

    await supabase.from("order_items").insert(items);

    // 3️⃣ clear cart
    localStorage.removeItem("cart");

    // 4️⃣ success page
    navigate("/orders");
  };

  return (
    <div className="payment-page">
      <h2>Payment</h2>

      <div className="payment-box">
        <p className="upi">UPI ID</p>
        <div className="upi-id">9873670361@jio</div>

        <p className="scan-text">Scan QR to pay</p>

        <img
          src="/upi-qr.png"
          alt="UPI QR"
          className="qr-img"
        />

        <div className="total-box">
          Total Amount
          <span>₹{total}</span>
        </div>

        <button className="pay-btn" onClick={placeOrder}>
          Pay ₹{total}
        </button>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>

        {cart.map((item) => (
          <div key={item.id} className="summary-item">
            <div>
              <strong>{item.name}</strong>
              <p>Qty: {item.qty}</p>
            </div>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <div className="summary-total">
          <span>Total</span>
          <strong>₹{total}</strong>
        </div>
      </div>
    </div>
  );
          }
