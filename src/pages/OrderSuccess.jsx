import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderUUID = searchParams.get("uuid");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderUUID) {
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_uuid", orderUUID)
        .single();

      if (error || !data) {
        console.error("Order fetch error:", error);
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [orderUUID, navigate]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Order not found
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>

        <h2>Order Created - Payment Pending</h2>

        <p className="warning">
          ⚠ Payment is NOT confirmed automatically.  
          Please complete UPI payment and send screenshot on WhatsApp.
        </p>

        <div className="order-box">
          <p><b>Order ID:</b> {order.order_code}</p>
          <p><b>Total:</b> ₹{order.total}</p>
          <p><b>Payment:</b> {order.payment_method}</p>
          <p>
            <b>Status:</b>{" "}
            <span className="pending">{order.payment_status}</span>
          </p>
        </div>

        <a
          href={`https://wa.me/919873670361?text=Payment%20done%20for%20Order%20${order.order_code}`}
          className="whatsapp-btn"
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
