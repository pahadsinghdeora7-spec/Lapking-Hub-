import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const courier = JSON.parse(localStorage.getItem("selected_courier"));
  const address = JSON.parse(localStorage.getItem("checkout_address"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ===============================
  // SAFETY CHECK
  // ===============================
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

  // ===============================
  // TOTAL
  // ===============================
  const itemsTotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const grandTotal = itemsTotal + Number(courier.price);

  // ===============================
  // CONFIRM & PAY
  // ===============================
  async function handleUPIPayment() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const orderCode =
      "LKH" + Math.floor(100000 + Math.random() * 900000);

    // ✅ ADDRESS JSON FORMAT
    const addressJSON = {
      name: address.full_name || "",
      phone: address.mobile || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || ""
    };

    const { error } = await supabase.from("orders").insert([
      {
        user_id: user.id,

        name: address.full_name || "",
        phone: address.mobile || "",

        address: addressJSON, // ✅ JSON

        shipping_name: courier.name,
        shipping_price: courier.price,

        total: grandTotal,

        payment_method: "UPI",
        payment_status: "Pending",
        order_status: "Order Placed",

        order_code: orderCode,

        items: cart // ✅ JSON
      }
    ]);

    if (error) {
      alert("Order save failed");
      console.log(error);
      return;
    }

    // ✅ success page
    navigate("/order/success");

    // ✅ open UPI app
    setTimeout(() => {
      const upiURL =
        `upi://pay?pa=9873670361@jio` +
        `&pn=LapkingHub` +
        `&am=${grandTotal}` +
        `&cu=INR`;

      window.location.href = upiURL;
    }, 400);
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div style={{ padding: 15 }}>
      <h2>Payment</h2>

      <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
        🔒 Secure checkout • Verified courier partners • Business support
      </p>

      {/* ORDER SUMMARY */}
      <div className="card">
        <h4>🧾 Order Summary</h4>

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
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
                <div style={{ fontWeight: 500 }}>{item.name}</div>
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

      {/* ADDRESS */}
      <div className="card">
        <h4>🏠 Delivery Address</h4>
        <p>{address.full_name}</p>
        <p>{address.address}</p>
        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>
      </div>

      {/* COURIER */}
      <div className="card">
        <h4>🚚 Courier</h4>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{courier.name}</span>
          <strong>₹{courier.price}</strong>
        </div>

        <p style={{ fontSize: 12, color: "#777" }}>
          Delivery charge depends on courier company
        </p>
      </div>

      {/* TOTAL */}
      <div
        className="card"
        style={{
          fontSize: 16,
          fontWeight: 600,
          borderTop: "1px dashed #ddd"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total Payable</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      <button
        onClick={handleUPIPayment}
        style={{
          width: "100%",
          marginTop: 15,
          background: "#28a745",
          color: "#fff",
          padding: 14,
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
        By placing order, you agree to LapkingHub terms & policies.
      </p>
    </div>
  );
}
