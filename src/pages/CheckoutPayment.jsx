import { useNavigate } from "react-router-dom";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const courierRaw = localStorage.getItem("selected_courier");
  const addressRaw = localStorage.getItem("checkout_address");
  const cartRaw = localStorage.getItem("cart");

  const courier = courierRaw ? JSON.parse(courierRaw) : null;
  const address = addressRaw ? JSON.parse(addressRaw) : null;
  const cart = cartRaw ? JSON.parse(cartRaw) : [];

  // 🔴 SAFETY CHECK
  if (!courier || !address || cart.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h3>⚠️ Checkout incomplete</h3>
        <p>Please complete checkout steps.</p>

        <button onClick={() => navigate("/checkout/shipping")}>
          ← Go Back
        </button>
      </div>
    );
  }

  const itemsTotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const grandTotal = itemsTotal + Number(courier.price);

  // ✅ FINAL UPI PAYMENT FLOW (WORKING 100%)
  function handleUPIPayment() {
    const upiId = "9873670361@jio";
    const name = "LapkingHub";
    const amount = grandTotal;

    const upiURL =
      `upi://pay?pa=${upiId}` +
      `&pn=${encodeURIComponent(name)}` +
      `&am=${amount}` +
      `&cu=INR`;

    // ✅ FIRST show order success page
    navigate("/order-success");

    // ✅ THEN open UPI app
    setTimeout(() => {
      window.location.href = upiURL;
    }, 300);
  }

  return (
    <div style={{ padding: 15 }}>

      <h2>Payment</h2>

      <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
        🔒 Secure checkout • Verified courier partners • Business support
      </p>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="card">
        <h4>🧾 Order Summary</h4>

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <img
                src={item.image}
                width={50}
                height={50}
                style={{
                  objectFit: "contain",
                  border: "1px solid #eee",
                  borderRadius: 6
                }}
                alt=""
              />

              <div>
                <div style={{ fontWeight: 500 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Qty: {item.qty}
                </div>
              </div>
            </div>

            <div style={{ fontWeight: 600 }}>
              ₹{item.price * item.qty}
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADDRESS ================= */}
      <div className="card">
        <h4>🏠 Delivery Address</h4>

        <p>{address.full_name}</p>
        <p>{address.address}</p>
        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>

        <p style={{ fontSize: 12, color: "#777" }}>
          📦 Order will be delivered to this address
        </p>
      </div>

      {/* ================= COURIER ================= */}
      <div className="card">
        <h4>🚚 Courier Details</h4>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <strong>{courier.name}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>
              Estimated delivery: {courier.days}
            </div>
          </div>

          <div style={{ fontWeight: 600 }}>
            ₹{courier.price}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
          💡 Delivery charge depends on selected courier company
        </p>
      </div>

      {/* ================= TOTAL ================= */}
      <div
        className="card"
        style={{
          borderTop: "1px dashed #ddd",
          fontSize: 16,
          fontWeight: 600
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total Payable</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* ================= PAY BUTTON ================= */}
      <button
        onClick={handleUPIPayment}
        style={{
          width: "100%",
          marginTop: 15,
          background: "#28a745",
          color: "#fff",
          padding: 13,
          borderRadius: 8,
          border: "none",
          fontSize: 16,
          fontWeight: 600
        }}
      >
        💳 Confirm & Pay Now
      </button>

      <p
        style={{
          fontSize: 12,
          color: "#777",
          textAlign: "center",
          marginTop: 10
        }}
      >
        By placing the order, you agree to LapkingHub terms & policies.
      </p>

    </div>
  );
}
