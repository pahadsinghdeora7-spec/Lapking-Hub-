import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Admin.css";

export default function AdminReplacementRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data } = await supabase
      .from("replacement_requests")
      .select("*")
      .order("id", { ascending: false });

    setRequests(data || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase
      .from("replacement_requests")
      .update({ status })
      .eq("id", id);

    loadRequests();
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading replacement requests...</div>;
  }

  return (
    <div className="card">

      <h3 style={{ marginBottom: 15 }}>🔁 Replacement Requests</h3>

      <div style={{ overflowX: "auto" }}>
        <table className="table">

          <thead>
            <tr>
              <th>#</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Reason</th>
              <th>Message</th>
              <th>Photos</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No replacement requests
                </td>
              </tr>
            ) : (
              requests.map((r, i) => (
                <tr key={r.id}>

                  <td>{i + 1}</td>

                  <td>#{r.order_id}</td>

                  <td>{r.customer_name || "Customer"}</td>

                  <td>{r.phone}</td>

                  <td>{r.product_name}</td>

                  <td>{r.reason_type}</td>

                  <td style={{ maxWidth: 200 }}>
                    {r.message || "—"}
                  </td>

                  <td>
                    {Array.isArray(r.images) && r.images.length > 0 ? (
                      r.images.map((img, idx) => (
                        <a
                          key={idx}
                          href={img}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={img}
                            alt=""
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 4,
                              marginRight: 5,
                              border: "1px solid #ccc"
                            }}
                          />
                        </a>
                      ))
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        color: "#fff",
                        background:
                          r.status === "approved"
                            ? "#2e7d32"
                            : r.status === "rejected"
                            ? "#c62828"
                            : "#f9a825"
                      }}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td>
                    {r.status === "pending" ? (
                      <>
                        <button
                          className="btn-small green"
                          onClick={() => updateStatus(r.id, "approved")}
                        >
                          Approve
                        </button>

                        <button
                          className="btn-small red"
                          onClick={() => updateStatus(r.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
            }
