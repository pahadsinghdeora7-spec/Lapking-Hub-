import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminReplacement.css";

export default function ReplacementRequests() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data, error } = await supabase
      .from("replacement_requests")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setRequests(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase
      .from("replacement_requests")
      .update({ status })
      .eq("id", id);

    setSelected(null);
    loadRequests();
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div className="dashboard">

      <h2 style={{ marginBottom: 15 }}>🔁 Replacement Requests</h2>

      <div className="card">
        <table className="table">
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
                  <td>{r.customer_name || "Customer"}</td>
                  <td>{r.phone || "-"}</td>
                  <td>{r.product_name || "-"}</td>
                  <td>{r.reason}</td>
                  <td>
                    <span className={`status ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
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
          <div className="admin-replace-modal">

            {/* HEADER */}
            <div className="admin-modal-header">
              📦 Replacement Details
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* BODY */}
            <div className="admin-modal-body">

              <div className="detail-row">
                <span>Order ID</span>
                <b>#{selected.order_id}</b>
              </div>

              <div className="detail-row">
                <span>Customer</span>
                <b>{selected.customer_name || "—"}</b>
              </div>

              <div className="detail-row">
                <span>Phone</span>
                <b>{selected.phone || "—"}</b>
              </div>

              <div className="detail-row">
                <span>Product</span>
                <b>{selected.product_name || "—"}</b>
              </div>

              <div className="detail-row">
                <span>Reason</span>
                <b>{selected.reason}</b>
              </div>

              <div className="detail-row">
                <span>Message</span>
                <div className="message-box">
                  {selected.message || "No message provided"}
                </div>
              </div>

              <div className="detail-row">
                <span>Photos</span>

                {selected.images ? (
                  <div className="admin-images">
                    {selected.images.split(",").map((img, i) => (
                      <img key={i} src={img} alt="proof" />
                    ))}
                  </div>
                ) : (
                  <div className="no-image">
                    📷 Image not uploaded
                  </div>
                )}
              </div>

            </div>

            {/* FOOTER */}
            <div className="admin-modal-footer">

              <button
                className="btn-approve"
                onClick={() => updateStatus(selected.id, "approved")}
              >
                ✅ Approve
              </button>

              <button
                className="btn-reject"
                onClick={() => updateStatus(selected.id, "rejected")}
              >
                ❌ Reject
              </button>

              <button
                className="btn-close"
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
