import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminCustomers.css";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);

    const { data: profiles, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const { data: orders = [] } = await supabase
      .from("orders")
      .select("id, user_id, total");

    const finalData = profiles.map(p => {
      const userOrders = orders.filter(o => o.user_id === p.user_id);
      const totalSpent = userOrders.reduce(
        (sum, o) => sum + Number(o.total || 0),
        0
      );

      return {
        ...p,
        ordersCount: userOrders.length,
        totalSpent
      };
    });

    setCustomers(finalData);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>👥 Customers</h2>
      <p style={{ color: "#666", marginBottom: 15 }}>
        Click on a customer to view full details
      </p>

      {loading ? (
        <p>Loading...</p>
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
                <th>City</th>
                <th>Total Spend</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, index) => (
                <tr
                  key={c.id}
                  className="row-click"
                  onClick={() => setSelectedCustomer(c)}
                >
                  <td>{index + 1}</td>
                  <td>{c.full_name || "—"}</td>
                  <td>{c.mobile || "—"}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.city || "—"}</td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{c.totalSpent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CUSTOMER POPUP ================= */}
      {selectedCustomer && (
        <div className="modal-backdrop">
          <div className="modal-box">

            <div className="modal-header">
              <h3>👤 Customer Details</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedCustomer(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p><b>Name:</b> {selectedCustomer.full_name}</p>
              <p><b>Mobile:</b> {selectedCustomer.mobile}</p>
              <p><b>Email:</b> {selectedCustomer.email}</p>

              <hr />

              <p><b>Business:</b> {selectedCustomer.business_name || "—"}</p>
              <p><b>GST:</b> {selectedCustomer.gst_number || "—"}</p>

              <p>
                <b>Address:</b>{" "}
                {selectedCustomer.address || "—"},{" "}
                {selectedCustomer.city || ""},{" "}
                {selectedCustomer.state || ""}{" "}
                {selectedCustomer.pincode || ""}
              </p>

              <hr />

              <p><b>Total Orders:</b> {selectedCustomer.ordersCount}</p>
              <p><b>Total Spent:</b> ₹{selectedCustomer.totalSpent}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
