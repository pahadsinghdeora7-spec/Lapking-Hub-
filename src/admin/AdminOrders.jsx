import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();

  useEffect(() => {
    loadOrders();
  }, [location.search]);

  async function loadOrders() {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    let query = supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    // ✅ PENDING ORDERS
    if (status === "pending") {
      query = query.in("order_status", [
        "Pending",
        "New",
        "Order Placed"
      ]);
    }

    // ✅ CANCELLED ORDERS
    if (status === "cancelled") {
      query = query.eq("order_status", "Cancelled");
    }

    // ✅ DELIVERED ORDERS (REVENUE CARD)
    if (status === "delivered") {
      query = query.eq("order_status", "Delivered");
    }

    const { data, error } = await query;
    if (!error) setOrders(data || []);
  }

  return (
    <div style={{ padding: 15 }}>

      <h2>📦 Orders</h2>

      {/* ================= ORDERS TABLE ================= */}
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
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>₹{order.total}</td>
                <td>{order.payment_status}</td>
                <td>{order.order_status}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= ORDER POPUP ================= */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-box">

            <div className="modal-header">
              <h3>📦 Order #{selectedOrder.order_code}</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">

              <h4>👤 Customer Details</h4>
              <p><b>Name:</b> {selectedOrder.name}</p>
              <p><b>Phone:</b> {selectedOrder.phone}</p>

              <h4 style={{ marginTop: 10 }}>🏠 Delivery Address</h4>
              <p>
                {typeof selectedOrder.address === "string"
                  ? selectedOrder.address
                  : `${selectedOrder.address?.address || ""}, 
                     ${selectedOrder.address?.city || ""}, 
                     ${selectedOrder.address?.state || ""} - 
                     ${selectedOrder.address?.pincode || ""}`}
              </p>

              <hr />

              <h4>🧾 Order Items</h4>
              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.map((item, i) => (
                  <div key={i} className="item-row">
                    <span>{item.name}</span>
                    <span>{item.qty} × ₹{item.price}</span>
                  </div>
                ))}

              <hr />

              <h4>🚚 Courier Details</h4>
              <p><b>Courier:</b> {selectedOrder.shipping_name}</p>
              <p><b>Charge:</b> ₹{selectedOrder.shipping_price}</p>

              <h3 className="total">
                Total Amount: ₹{selectedOrder.total}
              </h3>

              <hr />

              <div className="status-row">
                <div>
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
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Failed</option>
                  </select>
                </div>

                <div>
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
                      payment_status: selectedOrder.payment_status,
                      order_status: selectedOrder.order_status
                    })
                    .eq("id", selectedOrder.id);

                  alert("✅ Order updated successfully");
                  setSelectedOrder(null);
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
