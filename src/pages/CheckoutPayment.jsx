import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

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
      .single();

    setPayment(data);
  };

  const createOrder = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const orderCode = "LKH" + Date.now();

    const { error } = await supabase.from("orders").insert([
      {
        order_uuid: crypto.randomUUID(),
        order_code: orderCode,

        name: "Customer",
        phone: "NA",
        address: "NA",

        shipping_name: "Standard",
        shipping_price: shipping,
        total: total,

        payment_method: "UPI",
        payment_status: "pending",
        order_status: "new",

        user_id: user?.id || null
      }
    ]);

    if (error) {
      alert("Order create failed");
      console.log(error);
      return;
    }

    localStorage.removeItem("cart");

    navigate("/order-success", {
      state: { orderCode }
    });
  };

  if (!payment) return null;

  return (
    <div className="checkout-page">

      <h2>🔒 Secure Payment</h2>

      <div className="payment-card">
        <h3>King Metals</h3>

        <img
          src={payment.qr_image}
          alt="UPI QR"
          className="qr-img"
        />

        <p>Scan to pay using any UPI app</p>

        <div className="upi-box">
          <strong>UPI ID</strong>
          <div>{payment.upi_id}</div>
          <small>Google Pay • PhonePe • Paytm</small>
        </div>

        <button className="pay-btn" onClick={createOrder}>
          Confirm & Pay ₹{total}
        </button>
      </div>

      <div className="summary-box">
        <h3>Order Summary</h3>

        {cart.map((item, i) => (
          <div key={i} className="summary-row">
            <img src={item.image} />
            <div>
              <div>{item.name}</div>
              <small>Qty: {item.qty}</small>
            </div>
            <b>₹{item.price}</b>
          </div>
        ))}

        <hr />

        <div className="price-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="price-row">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="price-row total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}
