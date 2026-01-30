import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Orders() {
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

  return (
    <div style={{ padding: 15 }}>
      <h2>My Orders</h2>

      {orders.length === 0 && (
        <p>No orders found</p>
      )}

      {orders.map((o) => (
        <div key={o.id} className="card">
          <p><b>Order ID:</b> {o.order_code}</p>
          <p><b>Date:</b> {new Date(o.created_at).toLocaleDateString()}</p>
          <p><b>Total:</b> ₹{o.total}</p>
          <p><b>Payment:</b> {o.payment_status}</p>
          <p><b>Status:</b> {o.order_status}</p>

          <button style={{ marginTop: 8 }}>
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
