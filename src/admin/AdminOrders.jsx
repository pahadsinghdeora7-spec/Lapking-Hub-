import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminOrderView from "./AdminOrderView";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.name}</td>
                <td>{o.phone}</td>
                <td>₹{o.total}</td>
                <td>
                  <span className={`badge pay-${o.payment_status}`}>
                    {o.payment_status}
                  </span>
                </td>
                <td>
                  <span className={`badge order-${o.order_status}`}>
                    {o.order_status}
                  </span>
                </td>
                <td>
                  <button
                    className="view-btn"
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

      {/* ✅ MODAL */}
      {selectedOrder && (
        <AdminOrderView
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSaved={loadOrders}
        />
      )}
    </div>
  );
}
