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

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h3>📦 Order #{order.order_code}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* CUSTOMER */}
        <h4>👤 Customer Details</h4>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>User ID:</strong> {order.user_id}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>

        <hr />

        {/* ADDRESS */}
        <h4>🏠 Delivery Address</h4>
        <p>{order.address}</p>

        <hr />

        {/* ITEMS */}
        <h4>🧾 Order Items</h4>

        <table width="100%" border="1" cellPadding="6">
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

        <hr />

        {/* COURIER */}
        <h4>🚚 Courier Details</h4>
        <p><strong>Courier:</strong> {order.shipping_name}</p>
        <p><strong>Charge:</strong> ₹{order.shipping_price}</p>

        <hr />

        {/* TOTAL */}
        <h3>💰 Total Amount: ₹{order.total}</h3>

        <hr />

        {/* CONTROL */}
        <h4>⚙️ Order Control</h4>

        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
          <div>
            <label>Payment Status</label><br />
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Failed</option>
            </select>
          </div>

          <div>
            <label>Order Status</label><br />
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
        </div>

        {/* BUTTONS */}
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button onClick={onClose} style={{ marginRight: 10 }}>
            Close
          </button>

          <button onClick={updateOrder} disabled={loading}>
            {loading ? "Saving..." : "Save Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
