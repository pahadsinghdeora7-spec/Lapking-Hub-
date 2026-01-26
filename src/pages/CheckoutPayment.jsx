import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = 149;
  const total = subtotal + shipping;

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("status", true)
      .limit(1)
      .single();

    if (!error && data) {
      setPayment(data);
    }
  };

  if (!payment) return null;

  return (
    <div className="checkout-page">

      <h2>Payment</h2>

      {/* ✅ QR IMAGE — FINAL FIX */}
      {payment.qr_image && (
        <div className="qr-box">
          <img
            src={payment.qr_image}
            alt="UPI QR"
            style={{ width: "220px", maxWidth: "100%" }}
          />
          <p>Scan QR to pay via UPI</p>
        </div>
      )}

      {/* UPI */}
      <div className="upi-box">
        <strong>UPI ID</strong>
        <div>{payment.upi_id}</div>
      </div>

      {/* BUTTONS */}
      <div className="pay-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="pay-btn">
          Pay ₹{total}
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <h3>Order Summary</h3>

      <div className="summary-box">
        {cart.map((item, i) => (
          <div className="summary-item" key={i}>
            <img src={item.image} alt="" />
            <div>
              <div>{item.name}</div>
              <small>Qty: {item.qty}</small>
            </div>
            <strong>₹{item.price * item.qty}</strong>
          </div>
        ))}

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

    </div>
  );
}
