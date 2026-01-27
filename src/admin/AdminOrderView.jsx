import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminOrderView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setOrder(data);
    }

    setLoading(false);
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!order) return <p style={{ padding: 20 }}>Order not found</p>;

  const items = order.items || [];

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <h2>Order Details</h2>
        <button
          className="btn-outline"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* ORDER INFO */}
      <div className="card">
        <h3>Order Information</h3>

        <div className="form-grid">
          <div>
            <strong>Order ID</strong>
            <p>#{order.id}</p>
          </div>

          <div>
            <strong>Order Code</strong>
            <p>{order.order_code}</p>
          </div>

          <div>
            <strong>Date</strong>
            <p>{new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div>
            <strong>Payment</strong>
            <p>{order.payment_status}</p>
          </div>

          <div>
            <strong>Status</strong>
            <p>{order.order_status}</p>
          </div>

          <div>
            <strong>Total</strong>
            <p>₹{order.total}</p>
          </div>
        </div>
      </div>

      {/* CUSTOMER INFO */}
      <div className="card">
        <h3>Customer Details</h3>

        <div className="form-grid">
          <div>
            <strong>Name</strong>
            <p>{order.name}</p>
          </div>

          <div>
            <strong>Phone</strong>
            <p>{order.phone}</p>
          </div>

          <div className="input-wide">
            <strong>Address</strong>
            <p>{order.address}</p>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="card">
        <h3>Ordered Products</h3>

        {items.length === 0 ? (
          <p className="muted">No product data</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.qty}</td>
                  <td>
                    ₹{item.price * item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
        }
