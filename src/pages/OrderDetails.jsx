import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

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
  }

  if (!order) {
    return <p style={{ padding: 20 }}>Loading order...</p>;
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📦 Order Details</h2>

      <p><b>Order ID:</b> {order.order_code}</p>
      <p><b>Name:</b> {order.name}</p>
      <p><b>Phone:</b> {order.phone}</p>
      <p><b>Address:</b> {order.address}</p>

      <hr />

      <h4>🧾 Items</h4>

      {order.items?.map((item, i) => (
        <div key={i}>
          {item.name} × {item.qty} — ₹{item.price}
        </div>
      ))}

      <hr />

      <p><b>Total:</b> ₹{order.total}</p>
      <p><b>Payment:</b> {order.payment_status}</p>
      <p><b>Status:</b> {order.order_status}</p>

      <hr />

      <h4>🔁 Replacement</h4>
      <p>
        Agar product me problem hai to 7 din ke andar replacement
        request kar sakte ho.
      </p>
    </div>
  );
        }
