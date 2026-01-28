import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ ADMIN SECURITY CHECK (NEW)
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // not logged in
      if (!user) {
        navigate("/admin/login");
        return;
      }

      // check admin table
      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!admin) {
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="admin-panel">

      {/* ================= TOP BAR ================= */}
      <div className="admin-top">
        <button className="menu-btn" onClick={() => setOpen(true)}>
          ☰
        </button>

        <div className="logo">
          👑 <b>LapkingHub</b>
          <span className="small">Admin Panel</span>
        </div>

        <button className="view-store" onClick={() => navigate("/")}>
          View Store →
        </button>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${open ? "show" : ""}`}>
        <div className="side-head">
          <span>👑 LapkingHub</span>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/subcategories">Subcategories</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
          <NavLink to="/admin/reviews">Reviews</NavLink>
          <NavLink to="/admin/rewards">Rewards</NavLink>
          <NavLink to="/admin/support">Support Chats</NavLink>
          <NavLink to="/admin/couriers">Couriers</NavLink>
          <NavLink to="/admin/policies">Policies</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>

          {/* ✅ ABOUT US */}
          <NavLink to="/admin/about">About Us</NavLink>
        </nav>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}
