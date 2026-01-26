import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import "./admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    customers: 0,
    pending: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const { data: orders } = await supabase.from("orders").select("*");
    const { data: products } = await supabase.from("products").select("*");

    // ✅ revenue calculate
    const totalRevenue =
      orders?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;

    // ✅ pending orders
    const pendingOrders =
      orders?.filter(o => o.order_status === "new").length || 0;

    // ✅ low stock logic
    const low =
      products?.filter(p => Number(p.quantity) <= 5) || [];

    setLowStock(low);

    setStats({
      orders: orders?.length || 0,
      products: products?.length || 0,
      customers: 1, // future users table
      pending: pendingOrders,
      revenue: totalRevenue,
    });

    setRecentOrders(orders?.slice(0, 5) || []);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dash-head">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's what's happening.</p>
      </div>

      {/* ================= CARDS ================= */}
      <div className="stat-grid">

        <div className="stat-card green">
          <h4>₹{stats.revenue}</h4>
          <p>Revenue (This Month)</p>
        </div>

        <div className="stat-card green">
          <h4>₹{stats.revenue}</h4>
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
          <h4>{stats.customers || "NA"}</h4>
          <p>Total Customers</p>
        </div>

        <div className="stat-card yellow">
          <h4>{stats.pending}</h4>
          <p>Pending Orders</p>
        </div>

      </div>

      {/* ================= LOW STOCK ================= */}
      <div className="card">
        <h4>Low Stock Alert</h4>

        {lowStock.length === 0 ? (
          <p className="muted">All products in stock</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStock.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td style={{ color: "red", fontWeight: "600" }}>
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= RECENT ORDERS ================= */}
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
                <td>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "NA"}
                </td>
                <td>{order.name || "Customer"}</td>
                <td>₹{order.total || 0}</td>
                <td>
                  <span className="badge">
                    {order.order_status || "new"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
                    }
