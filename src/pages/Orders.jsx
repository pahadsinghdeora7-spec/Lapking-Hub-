import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📦 My Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 12,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <p><b>Order ID:</b> {o.order_code}</p>
          <p><b>Date:</b> {new Date(o.created_at).toLocaleString()}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Status:</b> {o.order_status}</p>

          {/* ✅ HASH ROUTER SAFE */}
          <button
            onClick={() => navigate(`#/order/${o.id}`)}
            style={{
              marginTop: 10,
              padding: "8px 14px",
              border: "none",
              borderRadius: 6,
              background: "#1976ff",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
