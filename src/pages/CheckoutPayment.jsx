import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [selectedApp, setSelectedApp] = useState("gpay");

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

      <h2 className="title">🔒 Secure Payment</h2>

      {/* ===== QR BOX ===== */}
      <div className="payment-card">

        <div className="merchant">
          <div className="merchant-logo">K</div>
          <div className="merchant-name">King Metals</div>
        </div>

        {payment.qr_image && (
          <img
            src={payment.qr_image}
            alt="UPI QR"
            className="qr-img"
          />
        )}

        <p className="scan-text">
          Scan to pay using any UPI app
        </p>

        <div className="upi-id-box">
          <strong>UPI ID</strong>
          <div>{payment.upi_id}</div>
          <small>Google Pay • PhonePe • Paytm</small>
        </div>

        {/* ===== UPI SELECT ===== */}
        <div className="upi-select">

          <div
            className={`upi-option ${selectedApp === "gpay" ? "active" : ""}`}
            onClick={() => setSelectedApp("gpay")}
          >
            <span className="upi-icon gpay">G</span>
            Google Pay
          </div>

          <div
            className={`upi-option ${selectedApp === "phonepe" ? "active" : ""}`}
            onClick={() => setSelectedApp("phonepe")}
          >
            <span className="upi-icon phonepe">₹</span>
            PhonePe
          </div>

          <div
            className={`upi-option ${selectedApp === "paytm" ? "active" : ""}`}
            onClick={() => setSelectedApp("paytm")}
          >
            <span className="upi-icon paytm">P</span>
            Paytm
          </div>

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

      </div>

      {/* ===== ORDER SUMMARY ===== */}
      <div className="summary-card">
        <h3>Order Summary</h3>

        {cart.map((item, i) => (
          <div key={i} className="summary-item">
            <img src={item.image} alt="" />
            <div>
              <div>{item.name}</div>
              <small>Qty: {item.qty}</small>
            </div>
            <strong>₹{item.price * item.qty}</strong>
          </div>
        ))}

        <div className="summary-line">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-line">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

    </div>
  );
            }
