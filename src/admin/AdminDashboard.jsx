import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    monthRevenue: 0,
    totalOrders: 0,
    pending: 0,
    cancelled: 0,
    products: 0,
    customers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const { data: orders = [] } = await supabase.from("orders").select("*");
    const { data: products = [] } = await supabase.from("products").select("*");

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const deliveredOrders = orders.filter(o => {
      const d = new Date(o.created_at);
      return (
        (o.order_status === "completed" ||
          o.order_status === "delivered") &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    const monthRevenue = deliveredOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    const pendingOrders = orders.filter(
      o => o.order_status === "pending" || o.order_status === "new"
    );

    const cancelledOrders = orders.filter(
      o => o.order_status === "cancelled"
    );

    const low = products.filter(p => Number(p.stock) <= 5);

    setStats({
      monthRevenue,
      totalOrders: orders.length,
      pending: pendingOrders.length,
      cancelled: cancelledOrders.length,
      products: products.length,
      customers: orders.length ? 1 : 0,
    });

    setRecentOrders(orders.slice(0, 5));
    setLowStock(low);
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

        <div
          className="stat-card green clickable"
          onClick={() => navigate("/admin/orders?status=completed")}
        >
          <h4>₹{stats.monthRevenue}</h4>
          <p>Revenue (Delivered - This Month)</p>
        </div>

        <div
          className="stat-card blue clickable"
          onClick={() => navigate("/admin/orders")}
        >
          <h4>{stats.totalOrders}</h4>
          <p>All Orders</p>
        </div>

        <div
          className="stat-card yellow clickable"
          onClick={() => navigate("/admin/orders?status=pending")}
        >
          <h4>{stats.pending}</h4>
          <p>Pending Orders</p>
        </div>

        <div
          className="stat-card red clickable"
          onClick={() => navigate("/admin/orders?status=cancelled")}
        >
          <h4>{stats.cancelled}</h4>
          <p>Cancelled Orders</p>
        </div>

        <div
          className="stat-card purple clickable"
          onClick={() => navigate("/admin/products")}
        >
          <h4>{stats.products}</h4>
          <p>Total Products</p>
        </div>

        <div
          className="stat-card orange clickable"
          onClick={() => navigate("/admin/customers")}
        >
          <h4>{stats.customers || "—"}</h4>
          <p>Total Customers</p>
        </div>

        {/* ➕ ADD PRODUCT */}
        <div
          className="stat-card add-product clickable"
          onClick={() => navigate("/admin/products/add")}
        >
          <h4>+</h4>
          <p>Add Product</p>
        </div>

        {/* 📄 BULK UPLOAD */}
        <div
          className="stat-card blue clickable"
          onClick={() => navigate("/admin/products/bulk-upload")}
        >
          <h4>📄</h4>
          <p>Bulk Upload</p>
        </div>

        {/* 🗑️ BULK DELETE */}
        <div
          className="stat-card red clickable"
          onClick={() => navigate("/admin/products/bulk-delete")}
        >
          <h4>🗑️</h4>
          <p>Bulk Delete</p>
        </div>

      </div>

      {/* ================= LOW STOCK ================= */}
      <div
        className="card clickable"
        onClick={() => navigate("/admin/products")}
      >
        <h4>Low Stock Alert</h4>

        {lowStock.length === 0 ? (
          <p className="muted">All products in stock</p>
        ) : (
          <table className="table">
            <tbody>
              {lowStock.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td style={{ color: "red", fontWeight: 600 }}>
                    {p.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div
        className="card clickable"
        onClick={() => navigate("/admin/orders")}
      >
        <h4>Recent Orders</h4>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No orders found
                </td>
              </tr>
            ) : (
              recentOrders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>{o.name || "Customer"}</td>
                  <td>₹{o.total}</td>
                  <td>{o.order_status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
      }
