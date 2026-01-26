import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import upiQR from "../assets/upi-qr.png";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = 149;
  const total = subtotal + shipping;

  const UPI_ID = "9873670361@jio";

  const createOrder = async () => {
    if (loading) return;
    setLoading(true);

    const orderCode =
      "LKH" + Math.floor(1000000000 + Math.random() * 9000000000);

    const { error } = await supabase.from("orders").insert([
      {
        name: "Customer",
        phone: "NA",
        address: "NA",
        shipping_name: "Standard",
        shipping_price: shipping,
        total: total,
        payment_method: "UPI",
        payment_status: "pending",
        order_status: "new",
        order_code: orderCode,
      },
    ]);

    if (error) {
      alert("Order create failed");
      setLoading(false);
      return;
    }

    // 🔗 UPI Deep Link
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=Lapking%20Hub&am=${total}&cu=INR`;

    window.location.href = upiLink;

    // after redirect attempt
    setTimeout(() => {
      navigate("/order/success", {
        state: {
          orderCode,
          total,
        },
      });
    }, 1500);
  };

  return (
    <div className="payment-page">
      <h2 className="payment-title">🔒 Secure UPI Payment</h2>

      <div className="payment-card">
        <div className="merchant">
          <div className="logo">L</div>
          <div>
            <strong>Lapking Hub</strong>
            <p>Official UPI Payment</p>
          </div>
        </div>

        <img src={upiQR} alt="UPI QR" className="qr-image" />

        <p className="scan-text">
          Scan this QR using any UPI app
        </p>

        <div className="upi-box">
          <strong>UPI ID</strong>
          <p>{UPI_ID}</p>
        </div>

        <div className="upi-icons">
          <span>Google Pay</span>
          <span>PhonePe</span>
          <span>Paytm</span>
        </div>

        <div className="note">
          ⚠️ Payment is verified manually by admin.  
          After payment, order will show <b>Payment Pending</b>.
        </div>

        <button className="pay-btn" onClick={createOrder}>
          {loading ? "Processing..." : `Pay ₹${total}`}
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <div className="summary-card">
        <h3>Order Summary</h3>

        {cart.map((item, i) => (
          <div className="summary-item" key={i}>
            <img src={item.image} alt="" />
            <div>
              <p>{item.name}</p>
              <small>Qty: {item.qty}</small>
            </div>
            <strong>₹{item.price}</strong>
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
    
  

