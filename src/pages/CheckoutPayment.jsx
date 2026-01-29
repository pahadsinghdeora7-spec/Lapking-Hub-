import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState(null);
  const [courier, setCourier] = useState(null);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart_items") || "[]");
    const addressData = JSON.parse(localStorage.getItem("checkout_address"));
    const courierData = JSON.parse(localStorage.getItem("selected_courier"));

    if (!cartData.length || !addressData || !courierData) {
      navigate("/");
      return;
    }

    setCart(cartData);
    setAddress(addressData);
    setCourier(courierData);
  }, [navigate]);

  const itemsTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const grandTotal = itemsTotal + Number(courier?.price || 0);

  function confirmOrder() {
    alert("Order placed successfully ✅");
    navigate("/order/success");
  }

  return (
    <div className="checkout-payment">

      <h2>Payment</h2>

      {/* ORDER SUMMARY */}
      <div className="pay-card">
        <h3>🧾 Order Summary</h3>

        {cart.map((item) => (
          <div key={item.id} className="summary-row">
            <img src={item.image} alt="" />

            <div className="summary-info">
              <div>{item.name}</div>
              <small>
                ₹{item.price} × {item.qty}
              </small>
            </div>

            <strong>
              ₹{item.price * item.qty}
            </strong>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="pay-card">
        <h3>🏠 Delivery Address</h3>
        <p><strong>{address.full_name}</strong></p>
        <p>📞 {address.mobile}</p>
        <p>
          {address.address}, {address.city}, {address.state} –{" "}
          {address.pincode}
        </p>
      </div>

      {/* COURIER */}
      <div className="pay-card">
        <h3>🚚 Courier Details</h3>

        <p><strong>{courier.name}</strong></p>
        <p>Delivery in {courier.days}</p>
        <p>Shipping Charge: ₹{courier.price}</p>

        <small className="note">
          Delivery charges depend on selected courier company.
        </small>
      </div>

      {/* PRICE */}
      <div className="pay-card">
        <h3>💰 Price Details</h3>

        <div className="price-row">
          <span>Items Total</span>
          <span>₹{itemsTotal}</span>
        </div>

        <div className="price-row">
          <span>Delivery Charge</span>
          <span>₹{courier.price}</span>
        </div>

        <hr />

        <div className="price-row total">
          <span>Total Payable</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      <button className="confirm-btn" onClick={confirmOrder}>
        Confirm Order
      </button>

    </div>
  );
}
