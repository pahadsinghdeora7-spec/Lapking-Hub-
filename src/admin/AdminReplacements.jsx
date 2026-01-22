import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminReplacements() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("replacement_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setList(data || []);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from("replacement_requests")
      .update({ status })
      .eq("id", id);

    load();
  };

  return (
    <div className="admin-orders">
      <h2>Replacement Requests</h2>

      {list.map((r) => (
        <div key={r.id} className="card">
          <p><b>Order:</b> #{r.order_id}</p>
          <p><b>Reason:</b> {r.reason}</p>
          <p><b>Message:</b> {r.message}</p>
          <p><b>Status:</b> {r.status}</p>

          {r.images &&
            r.images.split(",").map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                style={{ width: 80, marginRight: 8 }}
              />
            ))}

          <div style={{ marginTop: 10 }}>
            <button onClick={() => updateStatus(r.id, "approved")}>
              Approve
            </button>
            <button onClick={() => updateStatus(r.id, "rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
