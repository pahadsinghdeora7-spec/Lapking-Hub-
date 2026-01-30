import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 25, textAlign: "center" }}>
      <div style={{ fontSize: 70 }}>🎉</div>

      <h2>Order Placed Successfully</h2>

      <p style={{ marginTop: 8, color: "#555" }}>
        Thank you for shopping with LapkingHub
      </p>

      <p style={{ fontSize: 13, color: "#777" }}>
        Your order has been received and is being processed.
      </p>

      <div
        style={{
          background: "#f6fff8",
          border: "1px solid #b7ebc6",
          padding: 15,
          borderRadius: 8,
          marginTop: 20
        }}
      >
        📦 You will receive delivery updates on WhatsApp
      </div>

      <button
        onClick={() => navigate("/orders")}
        style={{
          marginTop: 20,
          background: "#2874f0",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: 6
        }}
      >
        View My Orders
      </button>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
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
