import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminOrderView({ order, onClose, onUpdated }) {
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [orderStatus, setOrderStatus] = useState(order.order_status);
  const [loading, setLoading] = useState(false);

  async function updateOrder() {
    setLoading(true);

    await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus
      })
      .eq("id", order.id);

    setLoading(false);

    alert("Order updated successfully ✅");

    onUpdated();
    onClose();
  }

  return (
    <div className="modal-backdrop">

      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h3>📦 Order #{order.order_code}</h3>
          <button onClick={onClose}>✖</button>
        </div>

        {/* CUSTOMER */}
        <div className="section">
          <h4>👤 Customer Details</h4>
          <p><b>Name:</b> {order.name}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>User ID:</b> {order.user_id}</p>
          <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>
        </div>

        {/* ADDRESS */}
        <div className="section">
          <h4>🏠 Delivery Address</h4>
          <p>{order.address?.full_name}</p>
          <p>{order.address?.address}</p>
          <p>
            {order.address?.city}, {order.address?.state} -{" "}
            {order.address?.pincode}
          </p>
        </div>

        {/* ITEMS */}
        <div className="section">
          <h4>🧾 Order Items</h4>

          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td style={{ display: "flex", gap: 10 }}>
                    <img
                      src={item.image}
                      alt=""
                      width={40}
                      height={40}
                      style={{ objectFit: "contain" }}
                    />
                    {item.name}
                  </td>
                  <td>₹{item.price}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SHIPPING */}
        <div className="section">
          <h4>🚚 Courier Details</h4>
          <p><b>Courier:</b> {order.shipping_name}</p>
          <p><b>Delivery:</b> {order.courier?.days}</p>
          <p><b>Charge:</b> ₹{order.shipping_price}</p>
        </div>

        {/* TOTAL */}
        <div className="section total">
          <h3>Total Amount: ₹{order.total}</h3>
        </div>

        {/* STATUS CONTROLS */}
        <div className="section">
          <h4>⚙ Order Control</h4>

          <div className="row">
            <label>Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="row">
            <label>Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="New">New</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* ACTION */}
        <div className="modal-footer">
          <button className="btn-gray" onClick={onClose}>
            Close
          </button>

          <button
            className="btn-primary"
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
