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
      .single();

    if (data) setPayment(data);
  };

  if (!payment) return null;

  const upiLinks = {
    gpay: `upi://pay?pa=${payment.upi_id}&pn=King%20Metals&am=${total}&cu=INR`,
    phonepe: `upi://pay?pa=${payment.upi_id}&pn=King%20Metals&am=${total}&cu=INR`,
    paytm: `upi://pay?pa=${payment.upi_id}&pn=King%20Metals&am=${total}&cu=INR`,
  };

  return (
    <div className="checkout-payment-page">

      <h2 className="title">🔒 Secure Payment</h2>

      {/* PAYMENT CARD */}
      <div className="payment-card">

        <div className="merchant">
          <div className="logo">K</div>
          <div className="name">King Metals</div>
        </div>

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

        {/* UPI APP SELECT */}
        <div className="upi-select">

          <div
            className={
              selectedApp === "gpay"
                ? "upi-option active"
                : "upi-option"
            }
            onClick={() => setSelectedApp("gpay")}
          >
            <img src="/gpay.svg" />
            Google Pay
          </div>

          <div
            className={
              selectedApp === "phonepe"
                ? "upi-option active"
                : "upi-option"
            }
            onClick={() => setSelectedApp("phonepe")}
          >
            <img src="/phonepe.svg" />
            PhonePe
          </div>

          <div
            className={
              selectedApp === "paytm"
                ? "upi-option active"
                : "upi-option"
            }
            onClick={() => setSelectedApp("paytm")}
          >
            <img src="/paytm.svg" />
            Paytm
          </div>

        </div>

        {/* BUTTONS */}
        <div className="pay-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>

          <a
            href={upiLinks[selectedApp]}
            className="pay-btn"
          >
            Confirm & Pay ₹{total}
          </a>
        </div>

      </div>

      {/* ORDER SUMMARY */}
      <div className="summary-card">
        <h3>Order Summary</h3>

        {cart.map((item, i) => (
          <div className="summary-row" key={i}>
            <img src={item.image} />
            <div className="info">
              <div>{item.name}</div>
              <small>Qty: {item.qty}</small>
            </div>
            <div className="price">₹{item.price}</div>
          </div>
        ))}

        <div className="total-box">
          <div>Subtotal <span>₹{subtotal}</span></div>
          <div>Shipping <span>₹{shipping}</span></div>
          <div className="final">
            Total <span>₹{total}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
