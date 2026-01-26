import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderUUID = searchParams.get("uuid");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderUUID) return;

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_uuid", orderUUID)
        .single();

      if (!error) setOrder(data);
    };

    fetchOrder();
  }, [orderUUID]);

  if (!order) {
    return <div className="loading">Loading order details...</div>;
  }

  return (
    <div className="order-success-page">

      {/* TOP CARD */}
      <div className="success-card">

        <div className="check-icon">✓</div>

        <h2>Order Created – Payment Pending</h2>

        <p className="warning">
          ⚠ Payment is NOT confirmed automatically.  
          Please complete UPI payment and send screenshot on WhatsApp.
        </p>

        <div className="top-info">
          <a
            className="whatsapp-btn"
            href={`https://wa.me/919873670361?text=Hello%20Lapking%20Hub,%20I%20have%20completed%20payment.%20Order%20ID:%20${order.order_code}`}
            target="_blank"
            rel="noreferrer"
          >
            📲 Send Payment Screenshot on WhatsApp
          </a>

          <div className="order-id">
            Order ID <br />
            <strong>{order.order_code}</strong>
          </div>
        </div>

        <div className="date">
          {new Date(order.created_at).toLocaleString("en-IN")}
        </div>
      </div>

      {/* DETAILS */}
      <div className="details-grid">

        <div className="detail-card">
          <h4>Delivery Address</h4>
          <p>
            {order.name}<br />
            {order.address}<br />
            📞 {order.phone}
          </p>
        </div>

        <div className="detail-card">
          <h4>Courier</h4>
          <p>{order.shipping_name}</p>
          <small>2–4 days</small>
        </div>

        <div className="detail-card">
          <h4>Payment</h4>
          <p>{order.payment_method}</p>
          <span className="status pending">{order.payment_status}</span>
        </div>

      </div>

      {/* ORDER SUMMARY */}
      <div className="summary-card">
        <h4>Order Summary</h4>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{order.total - order.shipping_price}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>₹{order.shipping_price}</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      <div className="actions">
        <button className="outline">View Order Details</button>
        <button className="primary" onClick={() => navigate("/")}>
          Continue Shopping →
        </button>
      </div>

    </div>
  );
}
