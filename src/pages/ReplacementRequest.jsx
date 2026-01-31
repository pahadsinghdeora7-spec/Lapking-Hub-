import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ReplacementRequest from "./ReplacementRequest";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [replaceItem, setReplaceItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replacementMap, setReplacementMap] = useState({});

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

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    const { data: replacements } = await supabase
      .from("replacement_requests")
      .select("*")
      .eq("user_id", user.id);

    const map = {};
    (replacements || []).forEach(r => {
      map[`${r.order_id}_${r.product_name}`] = r.status;
    });

    setReplacementMap(map);
    setOrders(ordersData || []);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 20 }}>⏳ Loading orders...</div>;
  }

  return (
    <div style={{ padding: 15 }}>

      <h2 style={{ marginBottom: 12 }}>📦 My Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {/* ================= ORDER LIST ================= */}
      {orders.map(order => (
        <div key={order.id} className="order-card">

          <div className="order-row">

            <div className="order-left">
              <p><b>Order ID:</b> {order.order_code}</p>
              <p>📅 {new Date(order.created_at).toLocaleDateString()}</p>
              <p>💳 {order.payment_status}</p>
            </div>

            <div className="order-right">
              <div className="order-total">₹{order.total}</div>
              <div className="order-status">{order.order_status}</div>
            </div>

          </div>

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

              {/* CUSTOMER */}
              <h4>👤 Customer</h4>
              <p>{selectedOrder.name || "—"}</p>
              <p>{selectedOrder.phone || "—"}</p>

              {/* ADDRESS */}
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

              {/* ITEMS */}
              <h4>🧾 Ordered Items</h4>

              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.map((item, i) => {
                  const key = `${selectedOrder.id}_${item.name}`;
                  const status = replacementMap[key];

                  return (
                    <div key={i} style={{ marginBottom: 14 }}>

                      <div className="item-row">
                        <span>{item.name}</span>
                        <span>{item.qty} × ₹{item.price}</span>
                      </div>

                      {/* 🔁 Replacement Logic */}
                      {status ? (
                        <p style={{
                          marginTop: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          color:
                            status === "approved"
                              ? "green"
                              : status === "rejected"
                              ? "red"
                              : "#f59e0b"
                        }}>
                          {status === "pending" && "⏳ Replacement under review"}
                          {status === "approved" && "✅ Replacement approved"}
                          {status === "rejected" && "❌ Replacement rejected"}
                        </p>
                      ) : selectedOrder.order_status === "Delivered" ? (
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
                          onClick={() => setReplaceItem(item)}
                        >
                          🔁 Request Replacement
                        </button>
                      ) : (
                        <p style={{
                          marginTop: 6,
                          fontSize: 12,
                          color: "#999"
                        }}>
                          Replacement available after delivery
                        </p>
                      )}

                    </div>
                  );
                })}

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

      {/* ================= REPLACEMENT POPUP ================= */}
      {replaceItem && (
        <ReplacementRequest
          order={selectedOrder}
          item={replaceItem}
          onClose={() => {
            setReplaceItem(null);
            loadOrders();
          }}
        />
      )}

    </div>
  );
                        }
