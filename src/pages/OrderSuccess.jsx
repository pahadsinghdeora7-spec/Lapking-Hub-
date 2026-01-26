// src/pages/OrderSuccess.jsx

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderUUID = searchParams.get("uuid");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderUUID) return;

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_uuid", orderUUID)
        .single();

      if (!error && data) {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderUUID]);

  if (loading) {
    return (
      <div className="order-loading">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-error">
        Order not found.
      </div>
    );
  }

  return (
    <div className="order-success-wrapper">

      {/* SUCCESS HEADER */}
      <div className="order-success-card">
        <div className="success-icon">✔</div>

        <h2>Order Created - Payment Pending</h2>

        <p className="warning-text">
          ⚠ Payment is NOT confirmed automatically.<br />
          Please complete UPI payment and send screenshot on WhatsApp.
        </p>

        <div className="order-id-box">
          <span>Order ID:</span>
          <b>{order.order_code || order.order_uuid}</b>
        </div>

        <a
          className="whatsapp-btn"
          href={`https://wa.me/9873670361?text=Payment%20Screenshot%20for%20Order%20${order.order_code}`}
          target="_blank"
          rel="noreferrer"
        >
          Send Payment Screenshot on WhatsApp
        </a>
      </div>

      {/* ORDER DETAILS */}
      <div className="order-details-card">
        <div className="detail-box">
          <h4>Delivery Address</h4>
          <p>{order.name}</p>
          <p>{order.address}</p>
          <p>{order.phone}</p>
        </div>

        <div className="detail-box">
          <h4>Payment</h4>
          <p>UPI (Manual Verification)</p>
          <span className="badge pending">
            {order.payment_status}
          </span>
        </div>
      </div>

      {/* PRICE SUMMARY */}
      <div className="order-summary-card">
        <div className="row">
          <span>Subtotal</span>
          <span>₹{order.total - order.shipping_price}</span>
        </div>

        <div className="row">
          <span>Shipping</span>
          <span>₹{order.shipping_price}</span>
        </div>

        <div className="row total">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      <button
        className="continue-btn"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
}
