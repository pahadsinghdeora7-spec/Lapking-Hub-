import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const uuid = params.get("uuid");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uuid) loadOrder();
  }, [uuid]);

  async function loadOrder() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_uuid", uuid)
      .single();

    if (!error) {
      setOrder(data);
    }

    setLoading(false);
  }

  if (loading) return <p className="loading">Loading order details...</p>;

  if (!order)
    return <p className="loading">Order not found</p>;

  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>

        <h2>Order Created - Payment Pending</h2>

        <p className="warning-text">
          Payment is NOT confirmed automatically. Please complete UPI payment
          and send screenshot on WhatsApp for verification.
        </p>

        <div className="order-box">
          <p><strong>Order ID:</strong> {order.order_code}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Payment:</strong> {order.payment_status}</p>
        </div>

        <a
          href={`https://wa.me/9873670361?text=Order%20ID:%20${order.order_code}%0APayment%20Screenshot`}
          className="whatsapp-btn"
        >
          Send Payment Screenshot on WhatsApp
        </a>

        <button
          className="continue-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
