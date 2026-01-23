import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    const { data: itemData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setOrder(orderData);
    setItems(itemData || []);
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-success-page">

      {/* HEADER */}
      <div className="success-box">
        <h2>✅ Order Created - Payment Pending</h2>
        <p className="warn">
          Payment is NOT confirmed automatically.  
          Please send payment screenshot on WhatsApp.
        </p>

        <div className="order-id">
          Order ID: <strong>LKH{order.id}</strong>
        </div>

        <a
          href={`https://wa.me/919873670361?text=Order%20ID%20LKH${order.id}%20Payment%20Screenshot`}
          className="whatsapp-btn"
          target="_blank"
          rel="noreferrer"
        >
          Send Payment Screenshot on WhatsApp
        </a>
      </div>

      {/* INFO */}
      <div className="info-grid">
        <div className="info-card">
          <h4>Delivery Address</h4>
          <p>{order.name}</p>
          <p>{order.address}</p>
          <p>{order.phone}</p>
        </div>

        <div className="info-card">
          <h4>Courier</h4>
          <p>{order.shipping_name}</p>
          <p>{order.shipping_days}</p>
        </div>

        <div className="info-card">
          <h4>Payment</h4>
          <p>UPI (Manual Confirmation)</p>
          <span className="badge pending">pending</span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="items-box">
        <h4>Order Items</h4>

        {items.map((item) => (
          <div className="item-row" key={item.id}>
            <div>
              <p>{item.name}</p>
              <small>
                ₹{item.price} × {item.qty}
              </small>

              {/* 🔁 REPLACEMENT BUTTON */}
              <Link
                to={`/replacement/${order.id}/${item.product_id}`}
                className="btn blue"
              >
                Request Replacement
              </Link>
            </div>

            <strong>₹{item.price * item.qty}</strong>
          </div>
        ))}

        {/* TOTAL */}
        <div className="total-box">
          <div>
            <span>Subtotal</span>
            <span>₹{order.total - order.shipping_price}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>₹{order.shipping_price}</span>
          </div>
          <div className="grand">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="success-actions">
        <Link to="/orders" className="outline-btn">
          View Order Details
        </Link>

        <Link to="/" className="primary-btn">
          Continue Shopping →
        </Link>
      </div>

    </div>
  );
}
