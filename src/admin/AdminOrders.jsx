import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminOrderView from "./AdminOrderView";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }
  }

  return (
    <div className="admin-page">

      <h2>🛒 Orders</h2>

      <div className="card">
        <table className="table">
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
              orders.map((o, index) => (
                <tr key={o.id}>
                  <td>{index + 1}</td>
                  <td>{o.name || "Customer"}</td>
                  <td>{o.phone || "NA"}</td>
                  <td>₹{o.total}</td>
                  <td>{o.payment_status}</td>
                  <td>{o.order_status}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedOrder(o)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ ORDER POPUP */}
      {selectedOrder && (
        <AdminOrderView
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

    </div>
  );
}
