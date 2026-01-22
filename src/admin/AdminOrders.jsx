import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
  };

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>LKH{o.id}</td>
              <td>{o.name}</td>
              <td>₹{o.total}</td>

              <td>
                <span className={`badge ${o.payment_status}`}>
                  {o.payment_status}
                </span>
              </td>

              <td>
                <span className="status">{o.order_status}</span>
              </td>

              <td>
                {new Date(o.created_at).toLocaleDateString()}
              </td>

              <td>
                <Link to={`/admin/orders/${o.id}`} className="view-btn">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
