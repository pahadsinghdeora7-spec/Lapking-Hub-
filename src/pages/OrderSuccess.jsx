import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const uuid = params.get("uuid");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uuid) return;

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_uuid", uuid)
        .single();

      if (!error) {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [uuid]);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading order details...</p>;
  }

  if (!order) {
    return <p style={{ padding: 20 }}>Order not found</p>;
  }

  return (
    <div className="order-success">

      <div className="success-card">
        <div className="check">✅</div>

        <h2>Order Created - Payment Pending</h2>

        <p className="warning">
          Payment is NOT confirmed automatically.  
          Please complete UPI payment and send screenshot on WhatsApp.
        </p>

        <div className="order-box">
          <b>Order ID:</b> {order.order_code} <br />
          <b>Total:</b> ₹{order.total}
        </div>

        <a
          className="whatsapp-btn"
          href={`https://wa.me/919873670361?text=Order%20ID:%20${order.order_code}`}
          target="_blank"
          rel="noreferrer"
        >
          Send Payment Screenshot on WhatsApp
        </a>

        <Link className="continue-btn" to="/">
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
