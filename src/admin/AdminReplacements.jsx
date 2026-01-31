import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminReplacements() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data, error } = await supabase
      .from("replacement_requests")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setRequests(data || []);
  }

  async function updateStatus(id, status) {
    await supabase
      .from("replacement_requests")
      .update({ status })
      .eq("id", id);

    loadRequests();
    setSelected(null);
  }

  return (
    <div className="admin-replacement-page">

      <h2>🔁 Replacement Requests</h2>

      <div className="admin-replacement-card">

        <table className="admin-replacement-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No replacement requests
                </td>
              </tr>
            ) : (
              requests.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>#{r.order_id}</td>
                  <td>{r.customer_name}</td>
                  <td>{r.phone}</td>
                  <td>{r.product_name}</td>
                  <td>{r.reason}</td>

                  <td>
                    <span className={`status-badge status-${r.status}`}>
                      {r.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="admin-action-btn btn-view"
                      onClick={() => setSelected(r)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

      {/* ================= POPUP ================= */}
      {selected && (
        <div className="modal-backdrop">
          <div className="modal-box">

            <h3>📦 Replacement Details</h3>

            <p><b>Order ID:</b> #{selected.order_id}</p>
            <p><b>Customer:</b> {selected.customer_name}</p>
            <p><b>Phone:</b> {selected.phone}</p>
            <p><b>Product:</b> {selected.product_name}</p>
            <p><b>Reason:</b> {selected.reason}</p>
            <p><b>Message:</b> {selected.message || "-"}</p>

            {selected.images && (
              <div style={{ marginTop: 10 }}>
                <b>Photos:</b>
                <div className="admin-images">
                  {selected.images.split(",").map((img, i) => (
                    <img key={i} src={img} alt="proof" />
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 15 }}>
              <button
                className="admin-action-btn btn-approve"
                onClick={() => updateStatus(selected.id, "approved")}
              >
                ✅ Approve
              </button>

              <button
                className="admin-action-btn btn-reject"
                onClick={() => updateStatus(selected.id, "rejected")}
              >
                ❌ Reject
              </button>

              <button
                className="admin-action-btn"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
                  }
