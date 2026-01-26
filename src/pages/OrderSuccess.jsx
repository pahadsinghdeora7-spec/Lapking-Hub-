import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderUUID = searchParams.get("uuid");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderUUID) return;

    fetchOrder();
  }, [orderUUID]);

  const fetchOrder = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_uuid", orderUUID)
      .single();

    if (error) {
      console.error("Order fetch error:", error);
    } else {
      setOrder(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="order-loading">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-loading">
        Order not found
      </div>
    );
  }

  return (
    <div className="order-success-container">

      {/* SUCCESS ICON */}
      <div className="success-icon">✅</div>

      <h2>Order Created - Payment Pending</h2>

      <p className="warning">
        ⚠ Payment is NOT confirmed automatically.  
        Please complete UPI payment and send screenshot on WhatsApp.
      </p>

      {/* ORDER INFO */}
      <div className="order-box">
        <div><b>Order ID:</b> {order.order_code}</div>
        <div><b>Total:</b> ₹{order.total}</div>
        <div><b>Payment:</b> {order.payment_method}</div>
        <div><b>Status:</b> {order.payment_status}</div>
      </div>

      {/* WHATSAPP */}
      <a
        className="whatsapp-btn"
        href={`https://wa.me/919873670361?text=Hello%20Lapking%20Hub%2C%20I%20have%20completed%20payment.%20Order%20ID%3A%20${order.order_code}`}
        target="_blank"
        rel="noreferrer"
      >
        Send Payment Screenshot on WhatsApp
      </a>

      {/* BUTTONS */}
      <div className="order-actions">
        <Link to="/" className="btn-outline">
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
