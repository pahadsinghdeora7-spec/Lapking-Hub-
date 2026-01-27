import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminOrders.css";

export default function AdminOrderView({ order, onClose }) {
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [orderStatus, setOrderStatus] = useState(order.order_status);
  const [saving, setSaving] = useState(false);

  async function handleUpdate() {
    setSaving(true);

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus,
      })
      .eq("id", order.id);

    setSaving(false);

    if (error) {
      alert("Update failed");
    } else {
      alert("Order updated successfully");
      onClose();
    }
  }

  return (
    <div className="order-modal-overlay">
      <div className="order-modal">

        {/* HEADER */}
        <div className="modal-head">
          <h3>📦 Order Details</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* INFO */}
        <div className="modal-section">
          <p><b>Order Code:</b> {order.order_code}</p>
          <p><b>Name:</b> {order.name || "Customer"}</p>
          <p><b>Phone:</b> {order.phone || "NA"}</p>
          <p><b>Address:</b> {order.address || "NA"}</p>
          <p><b>Total:</b> ₹{order.total}</p>
        </div>

        {/* STATUS */}
        <div className="modal-section">
          <label>Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>

          <label>Order Status</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="new">New</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* ACTION */}
        <div className="modal-actions">
          <button className="gray-btn" onClick={onClose}>
            Close
          </button>

          <button className="primary-btn" onClick={handleUpdate} disabled={saving}>
            {saving ? "Saving..." : "Save Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
