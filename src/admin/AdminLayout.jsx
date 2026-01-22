import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{
        width: 220,
        background: "#0056ff",
        color: "#fff",
        minHeight: "100vh",
        padding: 20
      }}>
        <h3>Admin</h3>

        <Link to="/admin" style={{ color: "#fff", display: "block", marginTop: 10 }}>
          Dashboard
        </Link>

        <Link to="/admin/products" style={{ color: "#fff", display: "block", marginTop: 10 }}>
          Products
        </Link>

        <Link to="/admin/categories" style={{ color: "#fff", display: "block", marginTop: 10 }}>
          Categories
        </Link>

        <Link to="/admin/orders" style={{ color: "#fff", display: "block", marginTop: 10 }}>
          Orders
        </Link>
      </div>

      {/* Page Content */}
      <div style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </div>

    </div>
  );
}
