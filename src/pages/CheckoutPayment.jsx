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
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("status", true)
      .limit(1)
      .single();

    if (data) setPayment(data);
  };

  // ✅ FINAL UPI DEEP LINK PAYMENT
  const handlePay = () => {
    const upiUrl =
      `upi://pay?pa=${payment.upi_id}` +
      `&pn=King%20Metals` +
      `&am=${total}` +
      `&cu=INR`;

    window.location.href = upiUrl;
  };

  if (!payment) return null;

  return (
    <div className="checkout-page">

      <h2 className="secure-title">🔒 Secure Payment</h2>

      {/* PAYMENT CARD */}
      <div className="payment-card">

        <div className="merchant">
          <div className="logo">K</div>
          <div className="name">King Metals</div>
        </div>

        {/* QR */}
        {payment.qr_image && (
          <img
            src={payment.qr_image}
            alt="UPI QR"
            className="qr-image"
          />
        )}

        <p className="scan-text">
          Scan to pay using any UPI app
        </p>

        <div className="upi-box">
          <strong>UPI ID</strong>
          <div>{payment.upi_id}</div>
          <small>Google Pay • PhonePe • Paytm</small>
        </div>

        {/* PAY BUTTONS */}
        <div className="pay-actions">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <button
            className="pay-btn"
            onClick={handlePay}
          >
            Confirm & Pay ₹{total}
          </button>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="order-summary">
        <h3>Order Summary</h3>

        {cart.map((item, i) => (
          <div className="summary-item" key={i}>
            <img src={item.image} alt="" />
            <div className="info">
              <div>{item.name}</div>
              <small>Qty: {item.qty}</small>
            </div>
            <div className="price">₹{item.price}</div>
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
