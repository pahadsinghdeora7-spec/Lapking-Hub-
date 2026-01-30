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
        setError("Unable to load orders. Try again.");
        setOrders([]);
      } else {
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError("Unexpected error. Try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 20 }}>⏳ Loading your orders...</div>;
  }

  return (
    <div style={{ padding: 15 }}>
      <h2 style={{ display: "flex", gap: 10, alignItems: "center" }}>
        📦 My Orders
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
          <p style={{ fontWeight: 600 }}>No orders found</p>
          <p style={{ color: "#555" }}>
            Your orders will appear here after checkout.
          </p>
        </div>
      )}

      {orders.map((o) => {
        const dateStr = o.created_at
          ? new Date(o.created_at).toLocaleString()
          : "-";

        return (
          <div
            key={o.id}
            style={{
              background: "#fff",
              padding: 15,
              marginBottom: 12,
              borderRadius: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
            }}
          >
            <p><b>Order ID:</b> {o.order_code || `#${o.id}`}</p>
            <p><b>Date:</b> {dateStr}</p>
            <p><b>Total:</b> ₹{o.total || 0}</p>
            <p><b>Payment:</b> {o.payment_status || "Pending"}</p>
            <p><b>Status:</b> {o.order_status || "Order Placed"}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {/* ✅ FIXED */}
              <button
                onClick={() => navigate(`#/order/${o.id}`)}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: 8,
                  background: "#1976ff",
                  color: "#fff",
                  fontWeight: 600
                }}
              >
                View Details
              </button>

              {/* ✅ FIXED */}
              <button
                onClick={() => navigate(`#/replacement/order/${o.id}`)}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: "#fff"
                }}
              >
                Replacement
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
