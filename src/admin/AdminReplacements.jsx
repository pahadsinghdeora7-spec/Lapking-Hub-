import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
} from "react-icons/fa";

export default function AdminReplacements() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const { data } = await supabase
      .from("replacement_requests")
      .select("*")
      .order("id", { ascending: false });

    setList(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from("replacement_requests")
      .update({ status })
      .eq("id", id);

    loadRequests();
  };

  return (
    <div className="admin-page">
      <h2>Replacement Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order</th>
                <th>Product</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Photo</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>#{r.order_id}</td>
                  <td>{r.product_id}</td>
                  <td>{r.user_email}</td>
                  <td>{r.reason_type}</td>

                  <td>
                    {r.image && (
                      <a
                        href={r.image}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaImage /> View
                      </a>
                    )}
                  </td>

                  <td>
                    <span className={`badge ${r.status}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="actions">
                    {r.status === "pending" && (
                      <>
                        <button
                          className="btn green"
                          onClick={() =>
                            updateStatus(r.id, "approved")
                          }
                        >
                          <FaCheckCircle /> Approve
                        </button>

                        <button
                          className="btn red"
                          onClick={() =>
                            updateStatus(r.id, "rejected")
                          }
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td colSpan="8" align="center">
                    No replacement requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
                }
