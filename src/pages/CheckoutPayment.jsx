import { useNavigate } from "react-router-dom";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const courierRaw = localStorage.getItem("selected_courier");
  const addressRaw = localStorage.getItem("checkout_address");
  const cartRaw = localStorage.getItem("cart");

  const courier = courierRaw ? JSON.parse(courierRaw) : null;
  const address = addressRaw ? JSON.parse(addressRaw) : null;
  const cart = cartRaw ? JSON.parse(cartRaw) : [];

  // 🔴 PREVENT BLANK PAGE
  if (!courier || !address || cart.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h3>⚠️ Incomplete checkout data</h3>
        <p>Please complete checkout steps.</p>

        <button onClick={() => navigate("/checkout/shipping")}>
          Go back
        </button>
      </div>
    );
  }

  const itemsTotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const grandTotal = itemsTotal + Number(courier.price);

  return (
    <div style={{ padding: 15 }}>
      <h2>Payment</h2>

      {/* ORDER SUMMARY */}
      <div className="card">
        <h4>Order Summary</h4>

        {cart.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: 10 }}>
            <img
              src={item.image}
              width={50}
              alt=""
            />
            <div>
              <div>{item.name}</div>
              <div>
                ₹{item.price} × {item.qty}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="card">
        <h4>Delivery Address</h4>
        <p>{address.full_name}</p>
        <p>{address.address}</p>
        <p>
          {address.city} - {address.pincode}
        </p>
      </div>

      {/* COURIER */}
      <div className="card">
        <h4>Courier</h4>
        <p>{courier.name}</p>
        <p>Delivery: {courier.days}</p>
        <p>Charge: ₹{courier.price}</p>
      </div>

      {/* TOTAL */}
      <div className="card">
        <h3>Total Payable: ₹{grandTotal}</h3>
      </div>

      <button className="confirm-btn">
        Confirm Order
      </button>
    </div>
  );
}
