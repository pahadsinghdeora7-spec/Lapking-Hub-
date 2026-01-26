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

      {/* ================= PAYMENT ================= */}
      <h2 style={{ display: "flex", alignItems: "center", gap: 6 }}>
        🔒 Secure Payment
      </h2>

      {/* QR BOX */}
      {payment.qr_image && (
        <div className="qr-box">
          <img
            src={payment.qr_image}
            alt="UPI QR"
            style={{ width: 220, maxWidth: "100%" }}
          />

          <p style={{ marginTop: 6, fontSize: 13 }}>
            Scan QR to pay via UPI
          </p>

          <p style={{ fontSize: 12, color: "#777" }}>
            100% safe UPI payment • Powered by UPI
          </p>
        </div>
      )}

      {/* UPI INFO */}
      <div className="upi-box">
        <strong>UPI ID</strong>
        <div>{payment.upi_id}</div>

        <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
          Pay using GPay, PhonePe, Paytm or any UPI app
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="pay-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="pay-btn">
          Confirm & Pay ₹{total}
        </button>
      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <h3 style={{ marginTop: 25 }}>
        Order Summary 🧾
      </h3>

      <div className="summary-box">

        {cart.map((item, i) => (
          <div key={i} className="summary-item">

            <img
              src={item.image}
              alt={item.name}
              className="summary-img"
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
          <div>Subtotal</div>
          <div>₹{subtotal}</div>
        </div>

        <div className="summary-total">
          <div>Shipping</div>
          <div>₹{shipping}</div>
        </div>

        <div className="summary-total grand">
          <div>Total</div>
          <div>₹{total}</div>
        </div>

      </div>

    </div>
  );
}
