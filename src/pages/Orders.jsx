import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setOrders(data || []);
  }

  // ✅ SAFE ITEMS PARSER
  function getItems(order) {
    if (!order.items) return [];

    if (Array.isArray(order.items)) {
      return order.items;
    }

    try {
      return JSON.parse(order.items);
    } catch {
      return [];
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>📦 My Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            marginBottom: 14,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          <p><b>Order ID:</b> {o.order_code}</p>
          <p><b>Date:</b> {new Date(o.created_at).toLocaleDateString()}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Payment:</b> {o.payment_status}</p>
          <p><b>Status:</b> {o.order_status}</p>

          <button
            onClick={() => setSelectedOrder(o)}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 12,
              background: "#1976ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600
            }}
          >
            View Details
          </button>
        </div>
      ))}

      {/* ================= POPUP ================= */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "92%",
              maxWidth: 420,
              borderRadius: 12,
              padding: 16,
              maxHeight: "85vh",
              overflowY: "auto"
            }}
          >
            <h3>📦 Order Details</h3>

            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>

            <hr />

            <h4>🧾 Items</h4>

            {getItems(selectedOrder).length === 0 && (
              <p>No items found</p>
            )}

            {getItems(selectedOrder).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6
                }}
              >
                <span>{item.name}</span>
                <span>{item.qty} × ₹{item.price}</span>
              </div>
            ))}

            <hr />

            <p><b>Courier:</b> {selectedOrder.shipping_name}</p>
            <p><b>Delivery:</b> ₹{selectedOrder.shipping_price}</p>
            <p><b>Total:</b> ₹{selectedOrder.total}</p>

            <hr />

            <div
              style={{
                background: "#f8f9fa",
                padding: 12,
                borderRadius: 8,
                fontSize: 13
              }}
            >
              🔁 <b>Replacement Policy</b>
              <ul style={{ paddingLeft: 18 }}>
                <li>3 days replacement available</li>
                <li>Photo / video required</li>
                <li>WhatsApp: 8306939006</li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                marginTop: 14,
                width: "100%",
                padding: 12,
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: 8
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
