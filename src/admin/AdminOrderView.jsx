import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminOrders.css";

export default function AdminOrderView({ order, onClose, onSaved }) {
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [orderStatus, setOrderStatus] = useState(order.order_status);
  const [saving, setSaving] = useState(false);

  async function saveUpdate() {
    setSaving(true);

    await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus,
      })
      .eq("id", order.id);

    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="order-modal-overlay">
      <div className="order-modal">

        {/* HEADER */}
        <div className="order-modal-head">
          <h3>📦 Order Details</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* BASIC INFO */}
        <div className="order-card-grid">
          <div>
            <label>Order Code</label>
            <p>{order.order_code}</p>
          </div>

          <div>
            <label>Total Amount</label>
            <p>₹{order.total}</p>
          </div>

          <div>
            <label>Customer Name</label>
            <p>{order.name}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{order.phone}</p>
          </div>

          <div className="full">
            <label>Address</label>
            <p>{order.address}</p>
          </div>
        </div>

        {/* STATUS */}
        <div className="status-grid">
          <div>
            <label>Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className={`status ${paymentStatus}`}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label>Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className={`status ${orderStatus}`}
            >
              <option value="new">New</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="order-products">
          <h4>🧾 Ordered Products</h4>

          {!order.items || order.items.length === 0 ? (
            <p className="muted">No product data</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ACTION */}
        <div className="modal-actions">
          <button className="btn-gray" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={saveUpdate} disabled={saving}>
            {saving ? "Saving..." : "Save Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
