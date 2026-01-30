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
    return <div style={{ padding: 20 }}>⏳ Loading your orders...</div>;
  }

  return (
    <div className="orders-page">

      <h2 className="orders-title">
        📦 My Orders
      </h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">

          {/* TOP */}
          <div className="order-top">
            <div>
              <p className="order-id">
                🧾 Order ID
              </p>
              <p className="order-code">{order.order_code}</p>
            </div>

            <span className="order-status">
              {order.order_status}
            </span>
          </div>

          {/* DETAILS */}
          <div className="order-info">
            <p>📅 <b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>
            <p>💳 <b>Payment:</b> {order.payment_status}</p>
            <p>💰 <b>Total:</b> ₹{order.total}</p>
          </div>

          {/* BUTTON */}
          <button
            className="view-details-btn"
            onClick={() => setSelectedOrder(order)}
          >
            👁 View Order Details
          </button>
        </div>
      ))}

      {/* ================= POPUP ================= */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-box">

            <div className="modal-header">
              <h3>📦 Order Details</h3>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">

              <p><b>Order ID:</b> {selectedOrder.order_code}</p>
              <p><b>Name:</b> {selectedOrder.name}</p>
              <p><b>Phone:</b> {selectedOrder.phone}</p>

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

              <h3 className="total-amount">
                Total: ₹{selectedOrder.total}
              </h3>

            </div>
          </div>
        </div>
      )}
    </div>
  );
      }
