import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import "./admin.css";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalOrders: null,
    totalProducts: null,
    totalCustomers: null,
    pendingOrders: null,
    totalRevenue: null,
    monthlyRevenue: null,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const safeValue = (value) => {
    if (value === null || value === undefined) return "Not Available";
    return value;
  };

  const loadDashboard = async () => {

    const { data: orders } = await supabase
      .from("orders")
      .select("*");

    const { data: products } = await supabase
      .from("products")
      .select("*");

    // Orders
    const totalOrders = orders?.length ?? null;

    // Pending
    const pendingOrders =
      orders?.filter(o => o.order_status === "new").length ?? null;

    // Revenue
    const totalRevenue =
      orders?.reduce((sum, o) => sum + (Number(o.total) || 0), 0) ?? null;

    // Monthly revenue
    const currentMonth = new Date().getMonth();
    const monthlyRevenue =
      orders?.filter(o =>
        new Date(o.created_at).getMonth() === currentMonth
      ).reduce((sum, o) => sum + (Number(o.total) || 0), 0) ?? null;

    // Customers (unique by phone)
    const customers =
      orders
        ? new Set(orders.map(o => o.phone)).size
        : null;

    setStats({
      totalOrders,
      totalProducts: products?.length ?? null,
      totalCustomers: customers,
      pendingOrders,
      totalRevenue,
      monthlyRevenue,
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

      {/* DASHBOARD CARDS */}
      <div className="stat-grid">

        <div className="stat-card green">
          <h4>₹{safeValue(stats.monthlyRevenue)}</h4>
          <p>Revenue (This Month)</p>
        </div>

        <div className="stat-card green">
          <h4>₹{safeValue(stats.totalRevenue)}</h4>
          <p>Revenue (Total)</p>
        </div>

        <div className="stat-card blue">
          <h4>{safeValue(stats.totalOrders)}</h4>
          <p>Total Orders</p>
        </div>

        <div className="stat-card purple">
          <h4>{safeValue(stats.totalProducts)}</h4>
          <p>Total Products</p>
        </div>

        <div className="stat-card orange">
          <h4>{safeValue(stats.totalCustomers)}</h4>
          <p>Total Customers</p>
        </div>

        <div className="stat-card yellow">
          <h4>{safeValue(stats.pendingOrders)}</h4>
          <p>Pending Orders</p>
        </div>

        <div className="stat-card red">
          <h4>Not Available</h4>
          <p>Return / Replacement</p>
        </div>

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
                <td>{order.name || "Customer"}</td>
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
