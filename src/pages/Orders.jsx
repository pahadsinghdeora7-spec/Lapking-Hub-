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
    return <div style={{ padding: 20 }}>â³ Loading orders...</div>;
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>ðŸ“¦ My Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          className="order-card"
        >
          <p><b>Order ID:</b> {order.order_code}</p>
          <p><b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>
          <p><b>Total:</b> â‚¹{order.total}</p>
          <p><b>Payment:</b> {order.payment_status}</p>
          <p><b>Status:</b> {order.order_status}</p>

          <button
            className="view-btn"
            onClick={() => setSelectedOrder(order)}
          >
            View Details
          </button>
        </div>
      ))}

      {/* ================= ORDER DETAILS POPUP ================= */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-box">

            <div className="modal-header">
              <h3>ðŸ“¦ Order #{selectedOrder.order_code}</h3>
              <button onClick={() => setSelectedOrder(null)}>âœ•</button>
            </div>

            <div className="modal-body">

              <h4>ðŸ‘¤ Customer</h4>
              <p>{selectedOrder.name}</p>
              <p>{selectedOrder.phone}</p>

              <h4>ðŸ  Address</h4>
              <p>
                {typeof selectedOrder.address === "string"
                  ? selectedOrder.address
                  : `${selectedOrder.address?.address || ""},
                     ${selectedOrder.address?.city || ""},
                     ${selectedOrder.address?.state || ""} -
                     ${selectedOrder.address?.pincode || ""}`}
              </p>

              <hr />

              <h4>ðŸ§¾ Items</h4>
              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.map((item, i) => (
                  <div key={i} className="item-row">
                    <span>{item.name}</span>
                    <span>{item.qty} Ã— â‚¹{item.price}</span>
                  </div>
                ))}

              <hr />

              <p><b>Shipping:</b> â‚¹{selectedOrder.shipping_price}</p>

              <h3>Total: â‚¹{selectedOrder.total}</h3>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
