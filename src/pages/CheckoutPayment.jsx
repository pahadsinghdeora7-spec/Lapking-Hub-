import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

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

    setPayment(data);
  };

  if (!payment) return null;

  return (
    <div className="checkout-page">

      <h2>🔒 Secure Payment</h2>

      {/* QR */}
      {payment.qr_image && (
        <div className="qr-box">
          <img src={payment.qr_image} alt="UPI QR" />
          <p>Scan QR to pay via UPI</p>
        </div>
      )}

      {/* UPI */}
      <div className="upi-box">
        <strong>UPI ID</strong>
        {payment.upi_id}
        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
          Pay using GPay, PhonePe, Paytm or any UPI app
        </div>
      </div>

      {/* Buttons */}
      <div className="pay-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="pay-btn">
          Confirm & Pay ₹{total}
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <h3>Order Summary</h3>

      <div className="summary-box">

        {cart.map((item, i) => (
          <div className="summary-item" key={i}>

            <img
              src={item.image}
              className="summary-img"
              alt={item.name}
            />

            <div className="summary-info">
              <div className="name">{item.name}</div>
              <div className="qty">Qty: {item.qty}</div>
            </div>

            <div className="price">
              ₹{item.price * item.qty}
            </div>

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
