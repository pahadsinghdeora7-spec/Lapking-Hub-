import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 60 }}>✅</div>

      <h2>Order Placed Successfully</h2>

      <p style={{ color: "#555", marginTop: 8 }}>
        Thank you for shopping with LapkingHub.
      </p>

      <p style={{ fontSize: 13, color: "#777", marginTop: 10 }}>
        Your order has been received and is being processed.
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 15,
          background: "#f6fff8",
          border: "1px solid #c7efd3",
          borderRadius: 8
        }}
      >
        📦 You will receive order updates via WhatsApp.
      </div>

      <button
        onClick={() => navigate("/orders")}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          background: "#2874f0",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 15
        }}
      >
        View My Orders
      </button>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#2874f0"
          }}
        >
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}
