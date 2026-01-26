import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const address = JSON.parse(localStorage.getItem("checkout_address")) || {};

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

  // 🔥 ORDER CREATE FUNCTION
  const createOrder = async () => {
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;

    // ORDER CODE
    const orderCode = "LKH" + Date.now();

    const { data, error } = await supabase.from("orders").insert([
      {
        name: address.name,
        phone: address.phone,
        address: address.full_address,
        shipping_name: "Standard Delivery",
        shipping_price: shipping,
        total: total,
        payment_meth: "UPI",
        payment_stat: "pending",
        order_status: "new",
        user_id: user?.id || null,
        order_code: orderCode,
      },
    ]).select().single();

    setLoading(false);

    if (!error && data) {
      localStorage.removeItem("cart");

      navigate(`/order-success/${data.id}`);
    } else {
      alert("Order create failed");
    }
  };

  if (!payment) return null;

  return (
    <div className="checkout-page">

      <h2>🔒 Secure Payment</h2>

      {/* QR */}
      <div className="qr-box">
        <div className="merchant">
          <div className="logo">K</div>
          <div className="name">King Metals</div>
        </div>

        {payment.qr_image && (
          <img src={payment.qr_image} alt="UPI QR" />
        )}

        <p className="scan-text">
          Scan to pay using any UPI app
        </p>
      </div>

      {/* UPI ID */}
      <div className="upi-box">
        <strong>UPI ID</strong>
        <div>{payment.upi_id}</div>
        <small>Google Pay • PhonePe • Paytm</small>
      </div>

      {/* PAY BUTTON */}
      <div className="pay-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <button
          className="pay-btn"
          disabled={loading}
          onClick={createOrder}
        >
          {loading ? "Creating Order..." : `Confirm & Pay ₹${total}`}
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <h3>Order Summary</h3>

      <div className="summary-box">
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
