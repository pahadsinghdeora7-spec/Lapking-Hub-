import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    customers: 0,
    pending: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    // Orders
    const { data: orders } = await supabase.from("orders").select("*");
    const { data: products } = await supabase.from("products").select("*");

    setStats({
      orders: orders?.length || 0,
      products: products?.length || 0,
      customers: 6, // temporary (future users table)
      pending: orders?.filter(o => o.order_status === "new").length || 0,
    });

    setRecentOrders(orders?.slice(0, 5) || []);
  };

  return (
    <div className="dashboard">

      {/* TITLE */}
      <div className="dash-head">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's what's happening.</p>
      </div>

      {/* STATS CARDS */}
      <div className="stat-grid">

        <div className="stat-card green">
          <h4>₹0</h4>
          <p>Revenue (This Month)</p>
        </div>

        <div className="stat-card green">
          <h4>₹0</h4>
          <p>Revenue (Total)</p>
        </div>

        <div className="stat-card blue">
          <h4>{stats.orders}</h4>
          <p>Total Orders</p>
        </div>

        <div className="stat-card purple">
          <h4>{stats.products}</h4>
          <p>Total Products</p>
        </div>

        <div className="stat-card orange">
          <h4>{stats.customers}</h4>
          <p>Total Customers</p>
        </div>

        <div className="stat-card yellow">
          <h4>{stats.pending}</h4>
          <p>Pending Orders</p>
        </div>

        <div className="stat-card red">
          <h4>0</h4>
          <p>Return / Replacement</p>
        </div>

      </div>

      {/* CHART PLACEHOLDER */}
      <div className="card">
        <h4>Orders - Last 7 Days</h4>
        <div className="chart-placeholder">
          Chart will appear here
        </div>
      </div>

      {/* LOW STOCK */}
      <div className="card">
        <h4>Low Stock Alert</h4>
        <p className="muted">All products in stock</p>
      </div>

      {/* RECENT ORDERS */}
      <div className="card">
        <h4>Recent Orders</h4>

        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No orders yet
                </td>
              </tr>
            )}

            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.name}</td>
                <td>₹{order.total}</td>
                <td>
                  <span className="badge">{order.order_status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
        }
