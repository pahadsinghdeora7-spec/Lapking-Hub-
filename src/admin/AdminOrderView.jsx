import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  // ===========================
  // LOAD ORDERS
  // ===========================
  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    setOrders(data || []);
  }

  // ===========================
  // OPEN MODAL
  // ===========================
  function openOrder(order) {
    setSelectedOrder(order);
    setPaymentStatus(order.payment_status);
    setOrderStatus(order.order_status);
  }

  // ===========================
  // UPDATE ORDER
  // ===========================
  async function updateOrder() {
    await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus
      })
      .eq("id", selectedOrder.id);

    setSelectedOrder(null);
    loadOrders();
  }

  return (
    <div style={{ padding: 20 }}>

      <h3>📦 Orders</h3>

      {/* ================= ORDERS LIST ================= */}
      <table width="100%" style={{ marginTop: 15 }}>
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
                <button onClick={() => openOrder(o)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div className="modal-backdrop">

          <div className="modal-box">

            <div className="modal-header">
              <h4>📦 Order #{selectedOrder.order_code}</h4>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {/* CUSTOMER */}
            <div className="section">
              <h4>👤 Customer Details</h4>
              <p><b>Name:</b> {selectedOrder.name}</p>
              <p><b>Phone:</b> {selectedOrder.phone}</p>
              <p><b>User ID:</b> {selectedOrder.user_id}</p>
              <p><b>Date:</b> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
            </div>

            {/* ADDRESS FIXED */}
            <div className="section">
              <h4>🏠 Delivery Address</h4>

              {selectedOrder.address ? (
                <>
                  <p><b>Name:</b> {selectedOrder.address.full_name}</p>
                  <p><b>Phone:</b> {selectedOrder.address.phone}</p>
                  <p><b>Address:</b> {selectedOrder.address.address}</p>
                  <p>
                    {selectedOrder.address.city}, {selectedOrder.address.state} – {selectedOrder.address.pincode}
                  </p>
                </>
              ) : (
                <p style={{ color: "red" }}>
                  Address not available
                </p>
              )}
            </div>

            {/* ITEMS */}
            <div className="section">
              <h4>🧾 Order Items</h4>

              <table width="100%">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.items?.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ORDER CONTROL */}
            <div className="section">
              <h4>⚙ Order Control</h4>

              <div style={{ display: "flex", gap: 10 }}>
                <div>
                  <p>Payment Status</p>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Failed</option>
                  </select>
                </div>

                <div>
                  <p>Order Status</p>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    <option>New</option>
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-gray" onClick={() => setSelectedOrder(null)}>
                Close
              </button>

              <button className="btn-primary" onClick={updateOrder}>
                Save Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
              }
