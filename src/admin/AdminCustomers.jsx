import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminCustomers.css";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);

    // 1️⃣ Get all user profiles (only logged-in users)
    const { data: profiles, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // 2️⃣ Get all orders
    const { data: orders = [] } = await supabase
      .from("orders")
      .select("id, user_id, total");

    // 3️⃣ Merge profile + order data
    const finalCustomers = profiles.map(profile => {
      const userOrders = orders.filter(
        o => o.user_id === profile.user_id
      );

      const totalSpent = userOrders.reduce(
        (sum, o) => sum + Number(o.total || 0),
        0
      );

      return {
        ...profile,
        ordersCount: userOrders.length,
        totalSpent
      };
    });

    setCustomers(finalCustomers);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>👥 Customers</h2>
      <p style={{ color: "#666", marginBottom: 15 }}>
        List of all logged-in customers
      </p>

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers found</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Business</th>
                <th>GST</th>
                <th>Orders</th>
                <th>Total Spent</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, index) => (
                <tr key={c.id}>
                  <td>{index + 1}</td>
                  <td>{c.full_name || "—"}</td>
                  <td>{c.mobile || "—"}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.business_name || "—"}</td>
                  <td>{c.gst_number || "—"}</td>
                  <td style={{ textAlign: "center" }}>
                    {c.ordersCount}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{c.totalSpent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
