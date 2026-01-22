import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        background: "#0f172a",
        color: "#fff",
        padding: 20
      }}>
        <h3>👑 Admin</h3>

        <p onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>Dashboard</p>
        <p onClick={() => navigate("/admin/products")} style={{ cursor: "pointer" }}>Products</p>
        <p onClick={() => navigate("/admin/categories")} style={{ cursor: "pointer" }}>Categories</p>
        <p onClick={() => navigate("/admin/orders")} style={{ cursor: "pointer" }}>Orders</p>

        <button onClick={logout}>Logout</button>
      </aside>

      {/* PAGE */}
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>

    </div>
  );
}
