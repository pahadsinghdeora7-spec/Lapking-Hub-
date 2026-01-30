import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📦 My Orders</h2>

      {orders.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 12,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <p><b>Order ID:</b> {o.order_code}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Status:</b> {o.order_status}</p>

          <button
            onClick={() => setSelectedOrder(o)}
            style={{
              marginTop: 10,
              padding: "8px 14px",
              border: "none",
              borderRadius: 6,
              background: "#1976ff",
              color: "#fff",
              fontWeight: 600
            }}
          >
            View Details
          </button>
        </div>
      ))}

      {/* ================= ORDER POPUP ================= */}
      {selectedOrder && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>📦 Order #{selectedOrder.order_code}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={closeBtn}
              >
                ✕
              </button>
            </div>

            <hr />

            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>

            <hr />

            <h4>🧾 Items</h4>
            {selectedOrder.items?.map((i, idx) => (
              <div key={idx}>
                {i.name} × {i.qty} — ₹{i.price}
              </div>
            ))}

            <hr />

            <p><b>Courier:</b> {selectedOrder.shipping_name}</p>
            <p><b>Delivery:</b> ₹{selectedOrder.shipping_price}</p>

            <h3>Total: ₹{selectedOrder.total}</h3>

            <p><b>Payment:</b> {selectedOrder.payment_status}</p>
            <p><b>Status:</b> {selectedOrder.order_status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalStyle = {
  width: "92%",
  maxWidth: "420px",
  background: "#fff",
  borderRadius: 12,
  padding: 18,
  boxShadow: "0 5px 20px rgba(0,0,0,0.25)"
};

const closeBtn = {
  border: "none",
  background: "#eee",
  borderRadius: "50%",
  width: 32,
  height: 32,
  cursor: "pointer"
};
