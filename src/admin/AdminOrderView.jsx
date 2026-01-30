import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminOrders.css";

export default function AdminOrderView({ order, onClose, onSaved }) {
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [orderStatus, setOrderStatus] = useState(order.order_status);
  const [loading, setLoading] = useState(false);

  async function updateOrder() {
    setLoading(true);

    await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus,
      })
      .eq("id", order.id);

    setLoading(false);
    onSaved();
    onClose();
  }

  return (
    <div className="modal-bg">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-head">
          <h3>ðŸ“¦ Order #{order.order_code}</h3>
          <button onClick={onClose}>âœ•</button>
        </div>

        {/* INFO GRID */}
        <div className="info-grid">
          <div>
            <label>Customer</label>
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

          <div>
            <label>Total</label>
            <p>â‚¹{order.total}</p>
          </div>
        </div>

        {/* STATUS */}
        <div className="status-box">
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

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="gray" onClick={onClose}>
            Close
          </button>
          <button className="blue" onClick={updateOrder}>
            {loading ? "Saving..." : "Save Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
