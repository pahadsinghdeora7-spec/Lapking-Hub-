import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();

  ...

  {orders.map((o) => (
    <div key={o.id} className="card">

      <p><b>Order ID:</b> {o.order_code}</p>
      <p><b>Total:</b> ₹{o.total}</p>
      <p><b>Status:</b> {o.order_status}</p>

      <button
        onClick={() => navigate(`/orders/${o.id}`)}
      >
        View Details
      </button>

    </div>
  ))}
}
