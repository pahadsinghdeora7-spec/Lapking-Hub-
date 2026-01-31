import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  }

  if (loading) {
    return <div className="loader">⏳ Loading your orders...</div>;
  }

  return (
    <div className="orders-page">

      <h2 className="page-title">📦 My Orders</h2>

      {orders.length === 0 && (
        <div className="empty-box">
          <p>🛒 No orders found</p>
        </div>
      )}

      {orders.map((order) => (
        <div key={order.id} className="order-card">

          <div className="order-top">
            <div>
              <div className="order-id">📄 Order ID</div>
              <div className="order-code">{order.order_code}</div>
            </div>

            <span className="status-badge">
              {order.order_status}
            </span>
          </div>

          <div className="order-row">
            <span>📅 Date</span>
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </div>

          <div className="order-row">
            <span>💳 Payment</span>
            <span>{order.payment_status}</span>
          </div>

          <div className="order-row total">
            <span>💰 Total</span>
            <span>₹{order.total}</span>
          </div>

          <button
            className="primary-btn"
            onClick={() => setSelectedOrder(order)}
          >
            👁 View Order Details
          </button>

        </div>
      ))}

      {/* ================= ORDER DETAILS MODAL ================= */}

      {selectedOrder && (
        <div className="modal-backdrop">

          <div className="modal-box">

            <div className="modal-header">
              <h3>📦 Order #{selectedOrder.order_code}</h3>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">

              <h4>👤 Customer</h4>
              <p>{selectedOrder.name}</p>
              <p>{selectedOrder.phone}</p>

              <h4>🏠 Delivery Address</h4>
              <p>
                {typeof selectedOrder.address === "string"
                  ? selectedOrder.address
                  : `${selectedOrder.address?.address || ""},
                     ${selectedOrder.address?.city || ""},
                     ${selectedOrder.address?.state || ""} -
                     ${selectedOrder.address?.pincode || ""}`}
              </p>

              <hr />

              <h4>🧾 Items</h4>

              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.map((item, i) => (
                  <div key={i} className="item-row">
                    <span>{item.name}</span>
                    <span>{item.qty} × ₹{item.price}</span>
                  </div>
                ))}

              <hr />

              <div className="order-row">
                <span>🚚 Shipping</span>
                <span>₹{selectedOrder.shipping_price}</span>
              </div>

              <div className="order-row total">
                <span>Total</span>
                <span>₹{selectedOrder.total}</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
