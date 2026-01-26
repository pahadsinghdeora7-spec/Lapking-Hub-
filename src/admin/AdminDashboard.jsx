import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    monthRevenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    pending: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const { data: orders = [] } = await supabase.from("orders").select("*");
    const { data: products = [] } = await supabase.from("products").select("*");

    // ============================
    // MONTH WISE REVENUE
    // ============================
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthOrders = orders.filter(o => {
      const d = new Date(o.created_at);
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

    const monthRevenue = monthOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    // ============================
    // PENDING
    // ============================
    const pendingOrders = orders.filter(
      o => o.order_status === "new"
    );

    // ============================
    // LOW STOCK
    // ============================
    const low = products.filter(
      p => Number(p.quantity) <= 5
    );

    setStats({
      monthRevenue,
      orders: orders.length,
      products: products.length,
      customers: orders.length ? 1 : 0,
      pending: pendingOrders.length,
    });

    setLowStock(low);
    setRecentOrders(orders.slice(0, 5));
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
          onClick={() => navigate("/admin/orders")}
        >
          <h4>₹{stats.monthRevenue}</h4>
          <p>Revenue (This Month)</p>
        </div>

        <div
          className="stat-card blue clickable"
          onClick={() => navigate("/admin/orders")}
        >
          <h4>{stats.orders}</h4>
          <p>Total Orders</p>
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
          <h4>{stats.customers || "Not Available"}</h4>
          <p>Total Customers</p>
        </div>

        <div
          className="stat-card yellow clickable"
          onClick={() => navigate("/admin/orders")}
        >
          <h4>{stats.pending}</h4>
          <p>Pending Orders</p>
        </div>

        <div className="stat-card red">
          <h4>Not Available</h4>
          <p>Return / Replacement</p>
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
                    {p.quantity}
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
                  No orders available
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
