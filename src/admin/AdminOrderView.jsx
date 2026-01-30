import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminOrderView({ order, onClose, onUpdated }) {
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [orderStatus, setOrderStatus] = useState(order.order_status);
  const [loading, setLoading] = useState(false);

  async function updateOrder() {
    setLoading(true);

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus
      })
      .eq("id", order.id);

    setLoading(false);

    if (error) {
      alert("Update failed");
      console.log(error);
      return;
    }

    alert("Order updated successfully");
    onUpdated();
    onClose();
  }

  const addr = order.address || {};

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">

        {/* HEADER */}
        <div className="modal-header">
          <h3>📦 Order #{order.order_code}</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* CUSTOMER */}
        <section>
          <h4>👤 Customer Details</h4>
          <p><b>Name:</b> {order.name}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>User ID:</b> {order.user_id}</p>
          <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>
        </section>

        {/* ADDRESS */}
        <section>
          <h4>🏠 Delivery Address</h4>
          <p>
            {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
          </p>
        </section>

        {/* ITEMS */}
        <section>
          <h4>🧾 Order Items</h4>

          <table className="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* COURIER */}
        <section>
          <h4>🚚 Courier Details</h4>
          <p><b>Courier:</b> {order.shipping_name}</p>
          <p><b>Charge:</b> ₹{order.shipping_price}</p>
        </section>

        {/* TOTAL */}
        <section>
          <h4>💰 Total Amount</h4>
          <strong>₹{order.total}</strong>
        </section>

        {/* CONTROL */}
        <section>
          <h4>⚙ Order Control</h4>

          <div className="control-row">
            <label>Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Failed</option>
            </select>
          </div>

          <div className="control-row">
            <label>Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option>Order Placed</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </section>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>

          <button
            className="btn-save"
            onClick={updateOrder}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
