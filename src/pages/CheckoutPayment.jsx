import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const shipping = 149;

  useEffect(() => {
    loadPayment();
    loadCart();
  }, []);

  const loadPayment = async () => {
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) setPayment(data);
  };

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const totalAmount = subtotal + shipping;

  if (!payment) return null;

  return (
    <div className="checkout-page">

      {/* ================= PAYMENT ================= */}
      <div className="card">
        <h3>Payment</h3>

        {/* QR IMAGE */}
        {payment.qr_url && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <img
              src={payment.qr_url}
              alt="QR"
              style={{
                width: 220,
                borderRadius: 12,
                border: "1px solid #eee",
              }}
            />
            <p style={{ marginTop: 10, color: "#555" }}>
              Scan this QR to pay via UPI
            </p>
          </div>
        )}

        {/* UPI */}
        <div className="upi-box">
          <b>UPI ID</b>
          <p>{payment.upi_id}</p>
        </div>
      </div>

      {/* ================= ACTION BUTTON ================= */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
        }}
      >
        <button
          className="btn-light"
          onClick={() => navigate("/checkout/shipping")}
        >
          Back
        </button>

        <button className="btn-primary">
          Pay ₹{totalAmount}
        </button>
      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="card" style={{ marginTop: 25 }}>
        <h3>Order Summary</h3>

        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">

            <img
              src={item.image}
              alt={item.name}
              className="summary-img"
            />

            <div className="summary-info">
              <p className="title">{item.name}</p>
              <span>
                Qty: {item.qty} × ₹{item.price}
              </span>
            </div>

            <b>₹{item.qty * item.price}</b>
          </div>
        ))}

        <hr />

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
          <span>₹{totalAmount}</span>
        </div>
      </div>

    </div>
  );
            }
