import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    monthRevenue: 0,
    totalOrders: 0,
    pending: 0,
    cancelled: 0,
    products: 0,
    customers: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [pendingReplacements, setPendingReplacements] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const { data: orders = [] } = await supabase.from("orders").select("*");
    const { data: products = [] } = await supabase.from("products").select("*");
    const { data: replacements = [] } = await supabase
      .from("replacement_requests")
      .select("id, status");

    /* ================= REPLACEMENTS ================= */
    setPendingReplacements(
      replacements.filter(r => r.status === "pending").length
    );

    /* ================= DATE ================= */
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    /* ================= REVENUE (DELIVERED + PAID) ================= */
    const deliveredOrders = orders.filter(o => {
      const d = new Date(o.created_at);
      return (
        o.order_status?.toLowerCase() === "delivered" &&
        o.payment_status?.toLowerCase() === "paid" &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    const monthRevenue = deliveredOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    /* ================= COUNTS ================= */
    const pendingOrders = orders.filter(
      o => o.order_status === "Order Placed"
    );

    const cancelledOrders = orders.filter(
      o => o.order_status === "Cancelled"
    );

    /* ================= LOW STOCK (SORTED) ================= */
    const low = products
      .filter(p => Number(p.stock) <= 5)
      .sort((a, b) => Number(a.stock) - Number(b.stock));

    setStats({
      monthRevenue,
      totalOrders: orders.length,
      pending: pendingOrders.length,
      cancelled: cancelledOrders.length,
      products: products.length,
      customers: new Set(orders.map(o => o.phone)).size
    });

    /* ================= RECENT ORDERS (NO CANCELLED) ================= */
    const cleanRecent = orders
      .filter(o => o.order_status !== "Cancelled")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    setRecentOrders(cleanRecent);
    setLowStock(low);
  };

  return (
    <div className="dashboard">

      <div className="dash-head">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's what's happening.</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="stat-grid">

        <div className="stat-card green clickable"
          onClick={() => navigate("/admin/orders?status=delivered")}>
          <h4>₹{stats.monthRevenue}</h4>
          <p>Revenue (Delivered - This Month)</p>
        </div>

        <div className="stat-card blue clickable"
          onClick={() => navigate("/admin/orders")}>
          <h4>{stats.totalOrders}</h4>
          <p>All Orders</p>
        </div>

        <div className="stat-card yellow clickable"
          onClick={() => navigate("/admin/orders?status=pending")}>
          <h4>{stats.pending}</h4>
          <p>Pending Orders</p>
        </div>

        <div className="stat-card red clickable"
          onClick={() => navigate("/admin/orders?status=cancelled")}>
          <h4>{stats.cancelled}</h4>
          <p>Cancelled Orders</p>
        </div>

        <div className="stat-card purple clickable"
          onClick={() => navigate("/admin/products")}>
          <h4>{stats.products}</h4>
          <p>Total Products</p>
        </div>

        <div className="stat-card orange clickable"
          onClick={() => navigate("/admin/customers")}>
          <h4>{stats.customers}</h4>
          <p>Total Customers</p>
        </div>

        <div className="stat-card purple clickable"
          onClick={() => navigate("/admin/replacements")}>
          <h4>{pendingReplacements}</h4>
          <p>Pending Replacement Requests</p>
        </div>

        <div className="stat-card blue clickable"
          onClick={() => navigate("/admin/add-product")}>
          <h4>➕</h4>
          <p>Add Product</p>
        </div>

        <div className="stat-card green clickable"
          onClick={() => navigate("/admin/bulk-upload")}>
          <h4>📤</h4>
          <p>Bulk Upload</p>
        </div>

        <div className="stat-card red clickable"
          onClick={() => navigate("/admin/bulk-delete")}>
          <h4>🗑</h4>
          <p>Bulk Delete</p>
        </div>

      </div>

      {/* ================= LOW STOCK ================= */}
      <div className="card">
        <h4>Low Stock Alert</h4>

        {lowStock.length === 0 ? (
          <p className="muted">All products in stock</p>
        ) : (
          <table className="table">
            <tbody>
              {lowStock.map(p => (
                <tr
                  key={p.id}
                  className="clickable"
                  onClick={() => navigate(`/admin/products?edit=${p.id}`)}
                >
                  <td>{p.name}</td>
                  <td style={{
                    color: Number(p.stock) === 0 ? "red" : "#d97706",
                    fontWeight: 700
                  }}>
                    {Number(p.stock) === 0 ? "Out of stock" : p.stock}
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
              <th>#</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr
                key={o.id}
                className="clickable"
                onClick={() => navigate(`/admin/orders?view=${o.id}`)}
              >
                <td>#{o.id}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>{o.name}</td>
                <td>₹{o.total}</td>
                <td>{o.order_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
