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
      <h2 style={{ marginBottom: 12 }}>📦 My Orders</h2>

      {orders.length === 0 && (
        <p style={{ color: "#777" }}>No orders found</p>
      )}

      {/* ================= ORDER LIST ================= */}
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
          <div style={{ fontSize: 13, color: "#1976ff", fontWeight: 600 }}>
            Order ID: {o.order_code}
          </div>

          <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>
            📅 {new Date(o.created_at).toLocaleDateString()}
          </div>

          <hr />

          <p>💰 <b>Total:</b> ₹{o.total}</p>

          <p>
            💳 <b>Payment:</b>{" "}
            <span
              style={{
                padding: "3px 8px",
                borderRadius: 6,
                fontSize: 12,
                background:
                  o.payment_status === "Paid"
                    ? "#e6f9f0"
                    : "#fff3cd",
                color:
                  o.payment_status === "Paid"
                    ? "#0f5132"
                    : "#856404"
              }}
            >
              {o.payment_status}
            </span>
          </p>

          <p>
            📦 <b>Status:</b>{" "}
            <span
              style={{
                padding: "3px 8px",
                borderRadius: 6,
                fontSize: 12,
                background: "#e7f1ff",
                color: "#084298"
              }}
            >
              {o.order_status}
            </span>
          </p>

          <button
            onClick={() => setSelectedOrder(o)}
            style={{
              marginTop: 12,
              width: "100%",
              padding: 12,
              background: "#1976ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600
            }}
          >
            👁 View Order Details
          </button>
        </div>
      ))}

      {/* ================= DETAILS POPUP ================= */}
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

            <p><b>Order ID:</b> {selectedOrder.order_code}</p>
            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>

            <hr />

            <h4>🧾 Items</h4>

            {selectedOrder.items?.map((i, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 6
                }}
              >
                <span>{i.name}</span>
                <span>{i.qty} × ₹{i.price}</span>
              </div>
            ))}

            <hr />

            <p>🚚 <b>Courier:</b> {selectedOrder.shipping_name}</p>
            <p>📦 <b>Delivery Charge:</b> ₹{selectedOrder.shipping_price}</p>
            <p style={{ fontWeight: 600 }}>
              💰 Total Paid: ₹{selectedOrder.total}
            </p>

            <hr />

            {/* 🔁 REPLACEMENT INFO */}
            <div
              style={{
                background: "#f8f9fa",
                padding: 12,
                borderRadius: 8,
                fontSize: 13
              }}
            >
              <b>🔁 Replacement Policy</b>
              <p style={{ marginTop: 6 }}>
                Agar product damaged / not working aaye:
              </p>
              <ul style={{ paddingLeft: 18 }}>
                <li>Delivery ke 3 din ke andar request kare</li>
                <li>Product photo / video required</li>
                <li>Approval ke baad replacement dispatch hoga</li>
                <li>Contact WhatsApp: <b>8306939006</b></li>
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
                borderRadius: 8,
                fontSize: 15
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
