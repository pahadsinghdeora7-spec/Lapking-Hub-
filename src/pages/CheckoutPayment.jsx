import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const shippingPrice = 149;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .single();

    setSettings(data);
    setLoading(false);
  }

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const total = subtotal + shippingPrice;

  async function handlePay() {
    try {
      if (cartItems.length === 0) {
        alert("Cart empty");
        return;
      }

      const orderCode =
        "LKH" + Math.floor(100000000 + Math.random() * 900000000);

      // ✅ SAVE FULL ORDER DATA
      const { data, error } = await supabase
        .from("orders")
        .insert({
          name: "Website Order",
          phone: "Not Provided",
          address: "Online Order",

          shipping_name: "Standard",
          shipping_price: shippingPrice,

          total: total,

          payment_method: "UPI",
          payment_status: "pending",
          order_status: "new",

          order_code: orderCode,

          // 🔥 MOST IMPORTANT
          items: cartItems,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        alert("Order create failed");
        return;
      }

      // 🔗 UPI DEEP LINK
      const upiLink = `upi://pay?pa=${settings.upi_id}&pn=Lapking%20Hub&am=${total}&cu=INR`;

      window.location.href = upiLink;

      setTimeout(() => {
        navigate(`/order/success?uuid=${data.order_uuid}`);
      }, 1000);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="payment-page">
      <h2 className="title">🔒 Secure UPI Payment</h2>

      <div className="payment-box">
        <div className="brand">
          <div className="logo">L</div>
          <div>
            <strong>Lapking Hub</strong>
            <p>Official UPI Payment</p>
          </div>
        </div>

        <img
          src={settings.qr_image}
          alt="UPI QR"
          className="qr-img"
        />

        <p className="scan-text">
          Scan this QR using any UPI app
        </p>

        <div className="upi-id">
          <strong>UPI ID</strong>
          <span>{settings.upi_id}</span>
        </div>

        <div className="upi-icons">
          <img src="/gpay.png" alt="gpay" />
          <img src="/phonepe.png" alt="phonepe" />
          <img src="/paytm.png" alt="paytm" />
        </div>

        <div className="warning">
          ⚠ Payment is verified manually by admin. Please complete payment carefully.
        </div>

        <button className="pay-btn" onClick={handlePay}>
          Pay ₹{total}
        </button>

        <p className="note">
          After payment, your order will be created with <b>Payment Pending</b> status.
        </p>
      </div>

      <div className="summary-box">
        <h3>🧾 Order Summary</h3>

        {cartItems.map((item) => (
          <div className="summary-item" key={item.id}>
            <span>
              {item.name} <br />
              Qty: {item.qty}
            </span>
            <strong>₹{item.price * item.qty}</strong>
          </div>
        ))}

        <div className="line" />

        <div className="row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="row">
          <span>Shipping</span>
          <span>₹{shippingPrice}</span>
        </div>

        <div className="row total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}
