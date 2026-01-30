import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedOrder");

    if (saved) {
      setOrder(JSON.parse(saved));
    }
  }, []);

  if (!order) {
    return (
      <div style={{ padding: 20 }}>
        ❌ Order not found
        <br /><br />
        <button onClick={() => navigate("/orders")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📦 Order #{order.order_code}</h2>

      <p><b>Name:</b> {order.name}</p>
      <p><b>Phone:</b> {order.phone}</p>

      <h3>📍 Address</h3>
      <pre>{JSON.stringify(order.address, null, 2)}</pre>

      <h3>🛒 Items</h3>
      {Array.isArray(order.items) &&
        order.items.map((i, idx) => (
          <div key={idx}>
            {i.name} × {i.qty} — ₹{i.price}
          </div>
        ))}

      <hr />

      <p><b>Total:</b> ₹{order.total}</p>
      <p><b>Payment:</b> {order.payment_status}</p>
      <p><b>Status:</b> {order.order_status}</p>
    </div>
  );
}
