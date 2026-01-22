import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminOrders.css";

export default function AdminReplacements() {
  const [list, setList] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const { data } = await supabase
      .from("replacements")
      .select("*")
      .order("created_at", { ascending: false });

    setList(data || []);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from("replacements")
      .update({ status })
      .eq("id", id);

    loadRequests();
  };

  return (
    <div className="admin-orders">
      <h2>Replacement Requests</h2>

      {list.length === 0 && <p>No replacement requests</p>}

      {list.map((r) => (
        <div key={r.id} className="card">

          <p><b>Order ID:</b> {r.order_id}</p>
          <p><b>Product ID:</b> {r.product_id}</p>
          <p><b>Reason:</b> {r.reason}</p>
          <p><b>Message:</b> {r.message}</p>
          <p>
            <b>Status:</b>{" "}
            <span className={`badge ${r.status}`}>
              {r.status}
            </span>
          </p>

          {r.image_url && (
            <img
              src={r.image_url}
              alt="replacement"
              style={{
                width: "100px",
                marginTop: "10px",
                borderRadius: "6px",
              }}
            />
          )}

          <div style={{ marginTop: "10px" }}>
            <button
              className="btn green"
              onClick={() => updateStatus(r.id, "approved")}
            >
              Approve
            </button>

            <button
              className="btn red"
              onClick={() => updateStatus(r.id, "rejected")}
              style={{ marginLeft: 10 }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
