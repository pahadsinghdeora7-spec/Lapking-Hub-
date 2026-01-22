import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 && (
        <p className="empty">No orders found</p>
      )}

      {orders.map((o) => (
        <div className="order-card" key={o.id}>
          <div className="row">
            <b>Order ID:</b> LKH{o.id}
          </div>

          <div className="row">
            <b>Date:</b>{" "}
            {new Date(o.created_at).toLocaleDateString()}
          </div>

          <div className="row">
            <b>Total:</b> ₹{o.total}
          </div>

          <div className="row">
            <b>Payment:</b>
            <span className={`badge ${o.payment_status}`}>
              {o.payment_status}
            </span>
          </div>

          <div className="row">
            <b>Status:</b>
            <span className={`status ${o.order_status}`}>
              {o.order_status}
            </span>
          </div>

          <div className="btn-row">
            <Link
              to={`/order/success/${o.id}`}
              className="btn blue"
            >
              View Details
            </Link>

            {o.payment_status === "pending" && (
              <a
                className="btn green"
                href={`https://wa.me/919873670361?text=Order%20ID%20LKH${o.id}%20Payment%20Screenshot`}
                target="_blank"
                rel="noreferrer"
              >
                Send Payment Screenshot
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
