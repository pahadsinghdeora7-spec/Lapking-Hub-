import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

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
    <div style={{ padding: 15 }}>
      <h2>📦 My Orders</h2>

      {orders.map((o) => (
        <div key={o.id} className="card" style={{ marginBottom: 15 }}>
          <p><b>Order ID:</b> {o.order_code}</p>
          <p><b>Date:</b> {new Date(o.created_at).toLocaleDateString()}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Status:</b> {o.order_status}</p>

          {/* ✅ THIS FIX */}
          <button
            style={{ marginTop: 8 }}
            onClick={() => setViewOrder(o)}
          >
            View Details
          </button>
        </div>
      ))}

      {/* ================= POPUP ================= */}
      {viewOrder && (
        <div className="modal-backdrop">
          <div className="modal-box">

            <h3>📦 Order #{viewOrder.order_code}</h3>

            <p><b>Name:</b> {viewOrder.name}</p>
            <p><b>Phone:</b> {viewOrder.phone}</p>
            <p><b>Address:</b> {viewOrder.address}</p>

            <hr />

            <h4>🧾 Items</h4>

            {(Array.isArray(viewOrder.items)
              ? viewOrder.items
              : []
            ).map((item, i) => (
              <div key={i}>
                {item.name} × {item.qty} — ₹{item.price}
              </div>
            ))}

            <hr />

            <p><b>Total:</b> ₹{viewOrder.total}</p>

            <p style={{ fontSize: 13, color: "#555" }}>
              🔁 Replacement available within 7 days  
              (Contact WhatsApp support)
            </p>

            <button
              style={{ marginTop: 10 }}
              onClick={() => setViewOrder(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
