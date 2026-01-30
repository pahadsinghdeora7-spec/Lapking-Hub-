import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    setOrder(data);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading order details...</div>;
  }

  if (!order) {
    return <div style={{ padding: 20 }}>Order not found</div>;
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📄 Order Details</h2>

      <div style={{
        background: "#fff",
        padding: 15,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>
        <p><b>Order ID:</b> {order.order_code}</p>
        <p><b>Name:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>Address:</b> {order.address}</p>

        <hr />

        <h4>🧾 Items</h4>

        {order.items?.map((item, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            {item.name} — {item.qty} × ₹{item.price}
          </div>
        ))}

        <hr />

        <p><b>Courier:</b> {order.shipping_name}</p>
        <p><b>Delivery:</b> ₹{order.shipping_price}</p>

        <h3>Total: ₹{order.total}</h3>

        <p><b>Payment:</b> {order.payment_status}</p>
        <p><b>Status:</b> {order.order_status}</p>
      </div>
    </div>
  );
      }
