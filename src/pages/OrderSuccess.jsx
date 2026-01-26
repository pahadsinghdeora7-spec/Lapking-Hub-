import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state;

  if (!order) {
    return (
      <div className="order-success-page">
        <h2>Order not found</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="order-success-page">

      <div className="success-card">

        <div className="success-icon">✅</div>

        <h2>Order Created - Payment Pending</h2>

        <p className="warning">
          Payment is NOT confirmed automatically.  
          Please complete UPI payment and send screenshot on WhatsApp.
        </p>

        <div className="order-box">
          <p><strong>Order ID:</strong> {order.order_code}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
        </div>

        <a
          className="whatsapp-btn"
          href={`https://wa.me/919873670361?text=Hello,%20I%20have%20completed%20payment.%20Order%20ID:%20${order.order_code}`}
          target="_blank"
          rel="noreferrer"
        >
          Send Payment Screenshot on WhatsApp
        </a>

        <button
          className="continue-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

      </div>
    </div>
  );
}
