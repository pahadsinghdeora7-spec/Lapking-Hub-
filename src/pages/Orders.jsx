import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

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

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((o) => (
        <div key={o.id} className="card" style={card}>
          <p><b>Order ID:</b> {o.order_code}</p>
          <p><b>Date:</b> {new Date(o.created_at).toLocaleDateString()}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Status:</b> {o.order_status}</p>

          <button style={btn} onClick={() => setSelected(o)}>
            View Details
          </button>
        </div>
      ))}

      {/* ================= MODAL ================= */}
      {selected && (
        <div style={backdrop}>
          <div style={modal}>
            <h3>📦 Order Details</h3>

            <p><b>Order:</b> {selected.order_code}</p>
            <p><b>Payment:</b> {selected.payment_status}</p>
            <p><b>Status:</b> {selected.order_status}</p>

            <hr />

            <h4>Items</h4>
            {selected.items?.map((i, idx) => (
              <p key={idx}>
                {i.name} × {i.qty} — ₹{i.price}
              </p>
            ))}

            <hr />

            <p><b>Delivery Address:</b></p>
            <p>{selected.address}</p>

            <hr />

            <p style={{ fontSize: 13, color: "#555" }}>
              🔁 Replacement available as per Warranty Policy.
              If product is damaged or faulty, request replacement
              within 7 days from delivery.
            </p>

            <button style={closeBtn} onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== styles ===== */

const card = {
  background: "#fff",
  padding: 15,
  borderRadius: 10,
  marginBottom: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
};

const btn = {
  marginTop: 8,
  padding: "8px 14px",
  border: "none",
  background: "#1976ff",
  color: "#fff",
  borderRadius: 6
};

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  width: "90%",
  maxWidth: 400
};

const closeBtn = {
  marginTop: 15,
  width: "100%",
  padding: 10,
  border: "none",
  background: "#000",
  color: "#fff",
  borderRadius: 8
};
