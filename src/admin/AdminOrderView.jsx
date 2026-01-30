import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    setOrders(data || []);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="admin-page">

      <h2>📦 Orders</h2>

      {/* ================= TABLE ================= */}
      <table className="orders-table">
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
              <td>{o.name}</td>
              <td>{o.phone}</td>
              <td>₹{o.total}</td>
              <td>{o.payment_status}</td>
              <td>{o.order_status}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => setViewOrder(o)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= POPUP ================= */}
      {viewOrder && (
        <div className="modal-backdrop">

          <div className="modal-box">

            <div className="modal-header">
              <h3>📦 Order #{viewOrder.order_code}</h3>

              <button
                className="close-btn"
                onClick={() => setViewOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">

              <p><b>Customer:</b> {viewOrder.name}</p>
              <p><b>Phone:</b> {viewOrder.phone}</p>
              <p><b>Address:</b> {viewOrder.address}</p>

              <hr />

              <h4>🧾 Order Items</h4>

              {viewOrder.items?.map((it, i) => (
                <div key={i} className="item-row">
                  <span>{it.name}</span>
                  <span>{it.qty} × ₹{it.price}</span>
                </div>
              ))}

              <hr />

              <p><b>Courier:</b> {viewOrder.shipping_name}</p>
              <p><b>Delivery Charge:</b> ₹{viewOrder.shipping_price}</p>
              <p className="total">Total: ₹{viewOrder.total}</p>

              <hr />

              <div className="status-row">
                <div>
                  <label>Payment</label>
                  <select
                    value={viewOrder.payment_status}
                    onChange={(e) =>
                      setViewOrder({
                        ...viewOrder,
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
                  <label>Order Status</label>
                  <select
                    value={viewOrder.order_status}
                    onChange={(e) =>
                      setViewOrder({
                        ...viewOrder,
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

              <button
                className="save-btn"
                onClick={async () => {
                  await supabase
                    .from("orders")
                    .update({
                      payment_status: viewOrder.payment_status,
                      order_status: viewOrder.order_status
                    })
                    .eq("id", viewOrder.id);

                  alert("Order updated");
                  setViewOrder(null);
                  loadOrders();
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
