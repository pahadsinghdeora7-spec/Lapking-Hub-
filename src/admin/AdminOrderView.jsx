import { useState } from "react";
import { supabase } from "../supabaseClient";

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

        <div className="modal-header">
          <h3>📦 Order #{order.order_code}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <h4>👤 Customer Details</h4>
        <p><b>Name:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>User ID:</b> {order.user_id}</p>
        <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>

        <hr />

        <h4>🏠 Delivery Address</h4>
        <p>{order.address}</p>

        <hr />

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

        <h4>🚚 Courier</h4>
        <p>{order.shipping_name}</p>
        <p>Charge: ₹{order.shipping_price}</p>

        <h3>💰 Total: ₹{order.total}</h3>

        <hr />

        <h4>⚙️ Order Control</h4>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Failed</option>
        </select>

        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option>Order Placed</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        <div style={{ marginTop: 15 }}>
          <button onClick={onClose}>Close</button>
          <button onClick={updateOrder} disabled={loading} style={{ marginLeft: 10 }}>
            {loading ? "Saving..." : "Save Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
