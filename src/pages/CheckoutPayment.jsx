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
      .limit(1)
      .single();

    if (data) setPayment(data);
  };

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const { error } = await supabase.from("orders").insert([
      {
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
        shipping_name: "Standard Delivery",
        shipping_price: shipping,
        total: total,
        payment_meth: "UPI",
        payment_stat: "pending",
        order_status: "new",
        user_id: user?.id,
      },
    ]);

    if (error) {
      alert("Order create failed");
      return;
    }

    // ✅ ONLY FIXED LINE
    navigate("/order/success");
  };

  if (!payment) return null;

  return (
    <div className="checkout-page">
      <h2>🔒 Secure Payment</h2>

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

      <div className="upi-box">
        <strong>UPI ID</strong>
        <div>{payment.upi_id}</div>
        <small>Google Pay · PhonePe · Paytm</small>
      </div>

      <div className="pay-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="pay-btn" onClick={handleConfirm}>
          Confirm & Pay ₹{total}
        </button>
      </div>
    </div>
  );
}
