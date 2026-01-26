import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadPayment();
    loadCart();
  }, []);

  // ================= PAYMENT SETTINGS =================
  const loadPayment = async () => {
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .limit(1)
      .single();

    setPayment(data);
  };

  // ================= CART =================
  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(items);
  };

  const subtotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const shipping = subtotal > 0 ? 149 : 0;
  const total = subtotal + shipping;

  if (!payment) return null;

  return (
    <div className="checkout-payment">

      <h2>Payment</h2>

      {/* ================= UPI INFO ================= */}
      <div className="payment-box">
        <p className="label">UPI ID</p>
        <p className="upi">{payment.upi_id}</p>
      </div>

      {/* ================= QR CODE ================= */}
      {payment.qr_url && (
        <div className="qr-box">
          <img src={payment.qr_url} alt="UPI QR" />
          <p className="qr-text">Scan QR to pay via UPI</p>
        </div>
      )}

      {/* ================= BUTTONS ================= */}
      <div className="pay-actions">
        <button className="btn-back" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="btn-pay">
          Pay ₹{total}
        </button>
      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="order-summary">
        <h3>Order Summary</h3>

        {cart.map((item) => (
          <div key={item.id} className="summary-item">
            <img src={item.image} alt={item.name} />

            <div className="info">
              <p className="name">{item.name}</p>
              <p className="qty">Qty: {item.qty}</p>
            </div>

            <div className="price">
              ₹{item.price * item.qty}
            </div>
          </div>
        ))}

        <div className="summary-total">
          <div>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div>
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div className="final">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
