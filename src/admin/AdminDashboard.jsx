import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "./admin.css";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: null,
    totalProducts: null,
    totalCustomers: null,
    pendingOrders: null,
    totalRevenue: null,
    monthlyRevenue: null,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const safe = (v) =>
    v === null || v === undefined ? "Not Available" : v;

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    const { data: orders } = await supabase.from("orders").select("*");
    const { data: products } = await supabase.from("products").select("*");

    const totalRevenue =
      orders?.reduce((s, o) => s + (Number(o.total) || 0), 0);

    const currentMonth = new Date().getMonth();
    const monthlyRevenue =
      orders
        ?.filter(o => new Date(o.created_at).getMonth() === currentMonth)
        .reduce((s, o) => s + (Number(o.total) || 0), 0);

    setStats({
      totalOrders: orders?.length ?? null,
      totalProducts: products?.length ?? null,
      totalCustomers: orders
        ? new Set(orders.map(o => o.phone)).size
        : null,
      pendingOrders: orders?.filter(o => o.order_status === "new").length ?? null,
      totalRevenue,
      monthlyRevenue,
    });

    setRecentOrders(orders?.slice(0, 5) || []);
  };

  return (
    <div className="dashboard">

      <div className="dash-head">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's what's happening.</p>
      </div>

      {/* 🔥 3 CARD GRID */}
      <div className="stat-grid-3">

        <div className="stat-card green clickable"
          onClick={() => navigate("/admin/orders")}
        >
          <h4>₹{safe(stats.monthlyRevenue)}</h4>
          <p>Revenue (This Month)</p>
        </div>

        <div className="stat-card green clickable"
          onClick={() => navigate("/admin/orders")}
        >
          <h4>₹{safe(stats.totalRevenue)}</h4>
          <p>Revenue (Total)</p>
        </div>

        <div className="stat-card blue clickable"
          onClick={() => navigate("/admin/orders")}
        >
          <h4>{safe(stats.totalOrders)}</h4>
          <p>Total Orders</p>
        </div>

        <div className="stat-card purple clickable"
          onClick={() => navigate("/admin/products")}
        >
          <h4>{safe(stats.totalProducts)}</h4>
          <p>Total Products</p>
        </div>

        <div className="stat-card orange clickable">
          <h4>{safe(stats.totalCustomers)}</h4>
          <p>Total Customers</p>
        </div>

        <div className="stat-card yellow clickable"
          onClick={() => navigate("/admin/orders")}
        >
          <h4>{safe(stats.pendingOrders)}</h4>
          <p>Pending Orders</p>
        </div>

        <div className="stat-card red clickable">
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
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.name || "Customer"}</td>
                <td>₹{order.total}</td>
                <td>{order.order_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
    }
