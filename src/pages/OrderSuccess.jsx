import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, textAlign: "center" }}>

      {/* ICON */}
      <div style={{ fontSize: 60 }}>🟡</div>

      <h2 style={{ marginTop: 10 }}>
        Payment Pending
      </h2>

      <p style={{ color: "#555", marginTop: 8 }}>
        Your order has been placed successfully.
      </p>

      <p style={{ fontSize: 13, color: "#777", marginTop: 5 }}>
        Payment confirmation is awaited from your UPI app.
      </p>

      {/* STATUS CARD */}
      <div
        style={{
          marginTop: 20,
          background: "#fffbe6",
          border: "1px solid #ffe58f",
          borderRadius: 8,
          padding: 15,
          textAlign: "left"
        }}
      >
        <p>✅ Order received</p>
        <p>🟡 Payment pending</p>
        <p>📦 Processing after confirmation</p>
        <p>🚚 Courier assignment next</p>
      </div>

      {/* INFO */}
      <p style={{ fontSize: 12, color: "#777", marginTop: 15 }}>
        If payment is deducted but status does not update,
        our team will verify and confirm manually.
      </p>

      {/* BUTTONS */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/orders")}
          style={{
            background: "#0d6efd",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 6,
            marginRight: 10
          }}
        >
          📦 View My Orders
        </button>

        <br /><br />

        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#0d6efd",
            fontSize: 14
          }}
        >
          Continue Shopping →
        </button>
      </div>

      {/* TRUST */}
      <p style={{ fontSize: 11, color: "#999", marginTop: 25 }}>
        Secure checkout • Verified sellers • LapkingHub support
      </p>

    </div>
  );
            }
