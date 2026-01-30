import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ALL ORDERS
  // =========================
  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setOrders(data || []);

    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  async function updateOrder() {
    if (!selectedOrder) return;

    await supabase
      .from("orders")
      .update({
        payment_status: selectedOrder.payment_status,
        order_status: selectedOrder.order_status
      })
      .eq("id", selectedOrder.id);

    alert("Order updated successfully");

    setSelectedOrder(null);
    fetchOrders();
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20 }}>

      <h2>📦 Orders</h2>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p>No orders found</p>
      )}

      {/* ================= TABLE ================= */}
      {!loading && orders.length > 0 && (
        <table
          width="100%"
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", marginTop: 10 }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th>#</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id}>
                <td>{i + 1}</td>
                <td>{o.name}</td>
                <td>{o.phone}</td>
                <td>₹{o.total}</td>
                <td>{o.payment_status}</td>
                <td>{o.order_status}</td>
                <td>
                  <button
                    style={{
                      padding: "6px 12px",
                      background: "#0d6efd",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4
                    }}
                    onClick={() => setSelectedOrder(o)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= POPUP ================= */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
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
              maxWidth: 500,
              padding: 20,
              borderRadius: 8
            }}
          >
            <h3>📦 Order #{selectedOrder.order_code}</h3>

            <hr />

            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>

            <hr />

            <h4>🧾 Items</h4>

            {selectedOrder.items?.map((item, i) => (
              <p key={i}>
                {item.name} × {item.qty} = ₹{item.price * item.qty}
              </p>
            ))}

            <hr />

            <p><b>Courier:</b> {selectedOrder.shipping_name}</p>
            <p><b>Charge:</b> ₹{selectedOrder.shipping_price}</p>
            <p><b>Total:</b> ₹{selectedOrder.total}</p>

            <hr />

            <div style={{ display: "flex", gap: 10 }}>
              <div>
                <label>Payment</label><br />
                <select
                  value={selectedOrder.payment_status}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      payment_status: e.target.value
                    })
                  }
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Failed</option>
                </select>
              </div>

              <div>
                <label>Order Status</label><br />
                <select
                  value={selectedOrder.order_status}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      order_status: e.target.value
                    })
                  }
                >
                  <option>Order Placed</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <br />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedOrder(null)}>
                Close
              </button>

              <button
                onClick={updateOrder}
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px"
                }}
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
            }
