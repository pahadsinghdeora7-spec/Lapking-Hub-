import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    customers: 0,
    pending: 0,
  });

  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    // products
    const { data: products } = await supabase
      .from("products")
      .select("*");

    // orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setStats({
      orders: orders?.length || 0,
      products: products?.length || 0,
      customers: 0,
      pending: orders?.filter(o => o.status === "pending").length || 0,
    });

    setLowStock(products?.filter(p => p.stock <= 2) || []);
    setRecentOrders(orders?.slice(0, 5) || []);
  };

  return (
    <div className="space-y-6">

      {/* TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card title="Total Orders" value={stats.orders} color="blue" />
        <Card title="Total Products" value={stats.products} color="purple" />
        <Card title="Customers" value={stats.customers} color="orange" />
        <Card title="Pending Orders" value={stats.pending} color="yellow" />

      </div>

      {/* GRAPH PLACEHOLDER */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-2">Orders - Last 7 Days</h3>
        <div className="h-40 flex items-center justify-center text-gray-400">
          Graph coming soon
        </div>
      </div>

      {/* LOW STOCK */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-3 text-orange-600">
          Low Stock Alert
        </h3>

        {lowStock.length === 0 ? (
          <p className="text-gray-500 text-sm">All products in stock</p>
        ) : (
          lowStock.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2 text-sm"
            >
              <span>{item.name}</span>
              <span className="text-red-500">Only {item.stock} left</span>
            </div>
          ))
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl p-4 shadow">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">Recent Orders</h3>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Order ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b">
                  <td className="py-2">{o.id}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>₹{o.total || 0}</td>
                  <td className="capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

function Card({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
        ₹
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
          }
