import { useLocation, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return (
      <div style={{ padding: 20 }}>
        ❌ Order data not found  
        <br />
        <button onClick={() => navigate("/orders")}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>📦 Order #{order.order_code}</h2>

      <h3>👤 Customer</h3>
      <p><b>Name:</b> {order.name}</p>
      <p><b>Phone:</b> {order.phone}</p>

      <h3>📍 Address</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(order.address, null, 2)}
      </pre>

      <h3>🛒 Items</h3>
      {Array.isArray(order.items) ? (
        order.items.map((item, i) => (
          <div key={i}>
            {item.name} × {item.qty} — ₹{item.price}
          </div>
        ))
      ) : (
        <p>No items</p>
      )}

      <hr />

      <p><b>Shipping:</b> ₹{order.shipping_price}</p>
      <p><b>Total:</b> ₹{order.total}</p>
      <p><b>Payment:</b> {order.payment_status}</p>
      <p><b>Status:</b> {order.order_status}</p>
    </div>
  );
        }
