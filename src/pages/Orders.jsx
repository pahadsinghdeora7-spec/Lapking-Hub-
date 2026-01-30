import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError("Unable to load orders. Try again.");
        setOrders([]);
      } else if (!Array.isArray(data)) {
        setOrders([]);
      } else {
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
      setError("Unexpected error. Try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        ⏳ Loading your orders...
      </div>
    );
  }

  return (
    <div style={{ padding: 15 }}>
      <h2 style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span role="img" aria-label="orders">📦</span>
        My Orders
      </h2>

      {error && (
        <div style={{ margin: "12px 0", color: "crimson" }}>{error}</div>
      )}

      {orders.length === 0 && (
        <div style={{
          background: "#fff",
          padding: 18,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>No orders found</p>
          <p style={{ marginTop: 6, color: "#555" }}>
            Your orders will appear here. Place an order to see it listed.
          </p>
        </div>
      )}

      {orders.map((o) => {
        const dateStr = o.created_at ? new Date(o.created_at).toLocaleString() : "-";
        return (
          <div
            key={o.id}
            style={{
              background: "#fff",
              padding: 15,
              marginBottom: 12,
              borderRadius: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: "#444" }}>
                  <strong>Order ID:</strong> {o.order_code || `#${o.id}`}
                </div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                  <strong>Date:</strong> {dateStr}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>₹{o.total || 0}</div>
                <div style={{ marginTop: 6 }}>
                  <span style={{
                    padding: "6px 10px",
                    borderRadius: 18,
                    fontSize: 12,
                    fontWeight: 600,
                    background: o.payment_status === "Paid" ? "#e6ffef" : "#fff8e6",
                    color: o.payment_status === "Paid" ? "#1a7f3a" : "#9a6a00",
                    border: "1px solid rgba(0,0,0,0.06)"
                  }}>
                    {o.payment_status || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "#666" }}><strong>Status:</strong> {o.order_status || "Order Placed"}</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  onClick={() => navigate(`/order/${o.id}`)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: 8,
                    background: "#1976ff",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    // open replace/return page (if exists)
                    navigate(`/replacement/order/${o.id}`);
                  }}
                  style={{
                    padding: "8px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    background: "#fff",
                    color: "#333",
                    cursor: "pointer"
                  }}
                >
                  Replacement
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
            }
