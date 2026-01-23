import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id);

    fetchOrders();
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">Orders</h2>

      {loading && <p>Loading orders...</p>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-2">#{o.id}</td>

                <td>
                  {new Date(o.created_at).toLocaleDateString()}
                </td>

                <td>{o.name}</td>

                <td>{o.phone}</td>

                <td>₹{o.total}</td>

                <td>
                  <select
                    value={o.order_status}
                    onChange={(e) =>
                      updateStatus(o.id, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    <option value="new">New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
      }
