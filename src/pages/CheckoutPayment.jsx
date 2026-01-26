import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = 149;
  const total = subtotal + shipping;

  const handlePay = () => {
    // 🔗 UPI deep link
    const upiUrl = `upi://pay?pa=9873670361@jio&pn=Lapking Hub&am=${total}&cu=INR`;

    window.location.href = upiUrl;

    // ⏳ little delay then order success
    setTimeout(() => {
      navigate("/order/success");
    }, 1200);
  };

  return (
    <div className="payment-page">

      <h2 className="secure-title">
        🔒 Secure UPI Payment
      </h2>

      <div className="payment-box">

        <div className="brand">
          <div className="logo-circle">L</div>
          <div>
            <strong>Lapking Hub</strong>
            <p>Official UPI Payment</p>
          </div>
        </div>

        <img
          src="/upi-qr.png"
          alt="UPI QR"
          className="qr-image"
        />

        <p className="scan-text">
          Scan this QR using any UPI app
        </p>

        <div className="upi-id">
          <strong>UPI ID</strong>
          <p>9873670361@jio</p>
        </div>

        <div className="upi-icons">
          <span>🟦 Google Pay</span>
          <span>🟪 PhonePe</span>
          <span>🟦 Paytm</span>
        </div>

        <div className="important-box">
          ⚠️ Payment is verified manually by admin.  
          Please complete payment carefully.
        </div>

        <button className="pay-btn" onClick={handlePay}>
          Pay ₹{total}
        </button>

        <p className="after-text">
          After payment, your order will be created with
          <strong> Payment Pending </strong> status.
        </p>
      </div>

      {/* ORDER SUMMARY */}
      <div className="order-summary">
        <h3>🧾 Order Summary</h3>

        {cart.map((item, i) => (
          <div className="order-item" key={i}>
            <img src={item.image} alt="" />
            <div>
              <p>{item.name}</p>
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

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

    </div>
  );
}
