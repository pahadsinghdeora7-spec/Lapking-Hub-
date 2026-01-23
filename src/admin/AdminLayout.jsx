import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Orders", path: "/admin/orders" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          w-64 bg-blue-600 text-white
          transition-transform
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 text-lg font-bold flex items-center gap-2">
          👑 LapkingHub
        </div>

        <nav className="mt-4">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm hover:bg-blue-700
                ${pathname === item.path ? "bg-blue-800" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 text-sm text-red-200">
          Logout
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-4">
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <h1 className="font-semibold">Admin Panel</h1>

          <a href="/" className="text-blue-600 text-sm">
            View Store →
          </a>
        </div>

        {/* Page */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
