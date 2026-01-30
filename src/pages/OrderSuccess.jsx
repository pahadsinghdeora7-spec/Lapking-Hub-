import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: 30,
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: 60 }}>✅</div>

      <h2 style={{ marginTop: 10 }}>
        Order Placed Successfully
      </h2>

      <p style={{ color: "#555", marginTop: 8 }}>
        Thank you for shopping with LapkingHub.
      </p>

      <p style={{ fontSize: 13, color: "#777", marginTop: 10 }}>
        Your order has been received and will be processed shortly.
      </p>

      <div
        style={{
          background: "#f8f9fa",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          fontSize: 14
        }}
      >
        📦 You will receive order confirmation on your registered email / WhatsApp.
      </div>

      <button
        style={{
          marginTop: 25,
          padding: "12px 25px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 15
        }}
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
}
