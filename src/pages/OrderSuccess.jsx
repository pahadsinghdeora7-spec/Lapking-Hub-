import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // clear cart after successful order
    localStorage.removeItem("cart");
    localStorage.removeItem("selected_courier");
    localStorage.removeItem("checkout_address");
  }, []);

  return (
    <div
      style={{
        padding: 25,
        textAlign: "center",
        maxWidth: 500,
        margin: "0 auto"
      }}
    >
      {/* SUCCESS ICON */}
      <div
        style={{
          fontSize: 70,
          marginBottom: 10
        }}
      >
        ✅
      </div>

      <h2 style={{ color: "#28a745", marginBottom: 8 }}>
        Order Placed Successfully!
      </h2>

      <p style={{ color: "#555", marginBottom: 20 }}>
        Thank you for your order with <strong>LapkingHub</strong>.
        <br />
        Your order has been confirmed and is being processed.
      </p>

      {/* INFO BOX */}
      <div
        style={{
          background: "#f8f9fa",
          padding: 15,
          borderRadius: 10,
          textAlign: "left",
          marginBottom: 20
        }}
      >
        <p>📦 <strong>Order Status:</strong> Confirmed</p>
        <p>🚚 <strong>Shipping:</strong> Courier assigned</p>
        <p>⏱ <strong>Delivery:</strong> As per selected courier</p>
        <p>💳 <strong>Payment:</strong> UPI initiated</p>
      </div>

      {/* TRUST TEXT */}
      <p style={{ fontSize: 13, color: "#666", marginBottom: 25 }}>
        🔒 Secure transaction • Verified courier partners • Business support
      </p>

      {/* BUTTONS */}
      <button
        onClick={() => navigate("/orders")}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "none",
          background: "#0d6efd",
          color: "#fff",
          fontSize: 15,
          marginBottom: 12
        }}
      >
        📄 View My Orders
      </button>

      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "#fff",
          fontSize: 15
        }}
      >
        🛒 Continue Shopping
      </button>

      {/* FOOTER NOTE */}
      <p
        style={{
          fontSize: 12,
          color: "#888",
          marginTop: 20
        }}
      >
        Need help? Contact LapkingHub support anytime.
      </p>
    </div>
  );
}
