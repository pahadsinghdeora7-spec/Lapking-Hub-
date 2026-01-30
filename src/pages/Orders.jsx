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

  return (
    <div style={{ padding: 16 }}>
      <h2>📦 My Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#fff",
            padding: 16,
            marginBottom: 14,
            borderRadius: 10,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
          }}
        >
          <p><b>Order:</b> {o.order_code}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Status:</b> {o.order_status}</p>

          <button
            onClick={() => setSelectedOrder(o)}
            style={{
              marginTop: 10,
              padding: 10,
              width: "100%",
              background: "#1976ff",
              color: "#fff",
              border: "none",
              borderRadius: 6
            }}
          >
            View Details
          </button>
        </div>
      ))}

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "90%",
              padding: 16,
              borderRadius: 10
            }}
          >
            <h3>Order Details</h3>

            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>

            <hr />

            <p><b>RAW ITEMS DATA:</b></p>

            <pre
              style={{
                fontSize: 12,
                background: "#f4f4f4",
                padding: 10,
                overflowX: "auto"
              }}
            >
              {JSON.stringify(selectedOrder.items, null, 2)}
            </pre>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                marginTop: 12,
                width: "100%",
                padding: 10,
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: 6
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
