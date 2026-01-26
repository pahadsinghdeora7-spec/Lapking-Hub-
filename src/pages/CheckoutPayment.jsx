import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../CheckoutPayment.css";

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
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("status", true)
      .limit(1)
      .single();

    if (data) setPayment(data);
  };

  if (!payment) return null;

  return (
    <div className="checkout-page">

      <h2>🔒 Secure Payment</h2>

      {/* ===== QR BOX ===== */}
      <div className="qr-box">
        <div className="merchant">
          <div className="logo">K</div>
          <div className="name">King Metals</div>
        </div>

        {payment.qr_image && (
          <img src={payment.qr_image} alt="UPI QR" />
        )}

        <p className="scan-text">Scan to pay using any UPI app</p>
      </div>

      {/* ===== UPI ===== */}
      <div className="upi-box">
        <strong>UPI ID</strong>
        <div>{payment.upi_id}</div>
        <small>Google Pay • PhonePe • Paytm</small>
      </div>

      {/* ===== BUTTONS ===== */}
      <div className="pay-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="pay-btn">
          Confirm & Pay ₹{total}
        </button>
      </div>

      {/* ===== ORDER SUMMARY ===== */}
      <h3 className="summary-title">Order Summary</h3>

      <div className="summary-box">
        {cart.map((item, i) => (
          <div className="summary-item" key={i}>
            <img
              src={item.image}
              alt={item.name}
              className="summary-img"
            />

            <div className="summary-info">
              <div className="name">{item.name}</div>
              <div className="qty">Qty: {item.qty}</div>
            </div>

            <div className="price">₹{item.price}</div>
          </div>
        ))}

        <div className="summary-total">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-total">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="summary-total grand">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

    </div>
  );
}
