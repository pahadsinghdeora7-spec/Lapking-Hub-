import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setOrders(data || []);
  }

  function openDetails(order) {
    localStorage.setItem(
      "selectedOrder",
      JSON.stringify(order)
    );
    navigate("/order-details");
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📦 My Orders</h2>

      {orders.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 12,
            borderRadius: 10
          }}
        >
          <p><b>Order ID:</b> {o.order_code}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Status:</b> {o.order_status}</p>

          <button
            onClick={() => openDetails(o)}
            style={{
              padding: "8px 14px",
              background: "#1976ff",
              color: "#fff",
              border: "none",
              borderRadius: 6
            }}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
