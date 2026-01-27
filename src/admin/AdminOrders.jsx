import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  }

  async function updateOrder() {
    await supabase
      .from("orders")
      .update({
        payment_status: selectedOrder.payment_status,
        order_status: selectedOrder.order_status
      })
      .eq("id", selectedOrder.id);

    alert("Order updated successfully");
    setSelectedOrder(null);
    loadOrders();
  }

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="admin-wrapper">

      <h2>🛒 Orders</h2>

      <div className="table-card">
        <table className="product-table">
          <thead>
            <tr>
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
                <td>{o.name || "Customer"}</td>
                <td>{o.phone || "NA"}</td>
                <td>₹{o.total}</td>

                <td>
                  <span className={`status ${o.payment_status}`}>
                    {o.payment_status}
                  </span>
                </td>

                <td>
                  <span className={`status ${o.order_status}`}>
                    {o.order_status}
                  </span>
                </td>

                <td>
                  <button
                    className="btn-primary"
                    onClick={() => setSelectedOrder(o)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ORDER DETAILS POPUP ================= */}

      {selectedOrder && (
        <div className="modal-overlay">

          <div className="modal-box">

            <h3>📦 Order Details</h3>

            <p><b>Order Code:</b> {selectedOrder.order_code}</p>
            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>

            <hr />

            <label>Payment Status</label>
            <select
              value={selectedOrder.payment_status}
              onChange={(e) =>
                setSelectedOrder({
                  ...selectedOrder,
                  payment_status: e.target.value
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>

            <label>Order Status</label>
            <select
              value={selectedOrder.order_status}
              onChange={(e) =>
                setSelectedOrder({
                  ...selectedOrder,
                  order_status: e.target.value
                })
              }
            >
              <option value="new">New</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <hr />

            <h4>🧾 Products</h4>

            {selectedOrder.items?.length ? (
              selectedOrder.items.map((item, i) => (
                <div key={i} className="order-item">
                  {item.name} × {item.qty} = ₹{item.price * item.qty}
                </div>
              ))
            ) : (
              <p className="muted">No product data</p>
            )}

            <div className="modal-actions">
              <button className="btn-primary" onClick={updateOrder}>
                Save Update
              </button>

              <button
                className="btn-outline"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
