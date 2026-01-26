import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const totalAmount = 1349;

  const handlePay = async () => {
    if (loading) return;
    setLoading(true);

    // 🔐 generate order code
    const orderCode =
      "LKH" + Date.now().toString().slice(-9);

    // ✅ create order first
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_code: orderCode,
          name: "Customer",
          phone: "NA",
          address: "NA",
          shipping_name: "Standard",
          shipping_price: 149,
          total: totalAmount,
          payment_method: "UPI",
          payment_status: "pending",
          order_status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Order create failed");
      setLoading(false);
      return;
    }

    // 🔗 UPI deep link
    const upiUrl =
      `upi://pay?pa=kingmetals517@okhdfcbank` +
      `&pn=King%20Metals` +
      `&am=${totalAmount}` +
      `&cu=INR` +
      `&tn=Order%20${orderCode}`;

    // 📱 open UPI app
    window.location.href = upiUrl;

    // ⏱ redirect to success page
    setTimeout(() => {
      navigate(`/order/success?id=${data.id}`);
    }, 1200);
  };

  return (
    <div className="payment-page">
      <h2>🔒 Secure UPI Payment</h2>

      <div className="payment-box">
        <img
          src="/upi-qr.png"
          alt="UPI QR"
          className="qr-img"
        />

        <p className="upi-text">
          Scan or pay using any UPI app
        </p>

        <div className="upi-icons">
          <img src="/gpay.png" />
          <img src="/phonepe.png" />
          <img src="/paytm.png" />
        </div>

        <button
          className="pay-btn"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Opening UPI..." : `Confirm & Pay ₹${totalAmount}`}
        </button>
      </div>
    </div>
  );
}
