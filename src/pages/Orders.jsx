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

  // ✅ REPLACEMENT REQUEST (FINAL)
  async function requestReplacement(item) {
    const reason = prompt(
      "Reason for replacement?\n(Damaged / Wrong item / Not working)"
    );

    if (!reason) return;

    const { error } = await supabase.from("replacements").insert({
      order_id: selectedOrder.id,
      product_id: item.product_id || null,
      customer_name: selectedOrder.name,
      phone: selectedOrder.phone,
      reason: reason,
      status: "pending"
    });

    if (error) {
      alert("❌ Replacement request failed");
      console.error(error);
    } else {
      alert("✅ Replacement request submitted successfully");
    }
  }

  if (loading) {
    return <div style={{ padding: 20 }}>⏳ Loading orders...</div>;
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📦 My Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <p><b>Order ID:</b> {order.order_code}</p>
          <p><b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>
          <p><b>Total:</b> ₹{order.total}</p>
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

              <h4>🧾 Ordered Items</h4>

              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.map((item, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>

                    <div className="item-row">
                      <span>{item.name}</span>
                      <span>
                        {item.qty} × ₹{item.price}
                      </span>
                    </div>

                    <button
                      style={{
                        marginTop: 6,
                        background: "#fff",
                        border: "1px solid #1976ff",
                        color: "#1976ff",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 13,
                        cursor: "pointer"
                      }}
                      onClick={() => requestReplacement(item)}
                    >
                      🔁 Request Replacement
                    </button>
                  </div>
                ))}

              <hr />

              <p><b>Shipping:</b> ₹{selectedOrder.shipping_price}</p>

              <h3>Total: ₹{selectedOrder.total}</h3>

              <p style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
                Replacement requests are reviewed within 24–48 hours.
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
                    }
