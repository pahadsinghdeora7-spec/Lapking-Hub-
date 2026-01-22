import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderSuccess.css";
import { supabase } from "../supabaseClient";

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

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setOrder(orderData);
    setItems(itemsData || []);
  };

  if (!order) return null;

  return (
    <div className="order-success">

      {/* SUCCESS BOX */}
      <div className="success-box">
        <div className="success-icon">✔</div>

        <h2>Order Created - Payment Pending</h2>

        <p className="warning">
          ⚠ Payment is NOT confirmed automatically
        </p>

        <p className="note">
          Please complete payment in your UPI app and send payment screenshot
          on WhatsApp for confirmation.
        </p>

        <a
          href={`https://wa.me/919873670361?text=Order%20ID%20LKH${order.id}%20Payment%20Screenshot`}
          className="whatsapp-btn"
          target="_blank"
          rel="noreferrer"
        >
          Send Payment Screenshot on WhatsApp
        </a>

        <div className="order-id">
          Order ID: <strong>LKH{order.id}</strong>
        </div>
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
              <small>₹{item.price} × {item.qty}</small>
            </div>
            <strong>₹{item.price * item.qty}</strong>
          </div>
        ))}

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
