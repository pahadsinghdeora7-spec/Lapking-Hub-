import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderUUID = searchParams.get("uuid");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderUUID) {
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [orderUUID]);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          qty,
          price,
          products (
            name,
            image
          )
        )
      `)
      .eq("order_uuid", orderUUID)
      .single();

    if (!error) {
      setOrder(data);
    }

    setLoading(false);
  };

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
      {/* ✅ DESIGN SAME — KUCH CHANGE NAHI */}

      <div className="success-box">
        <div className="success-icon">✅</div>

        <h2>Order Created - Payment Pending</h2>

        <p className="warning-text">
          ⚠ Payment is NOT confirmed automatically. Please complete UPI payment
          and send screenshot on WhatsApp for confirmation.
        </p>

        <div className="order-id">
          <strong>Order ID:</strong> {order.order_code}
        </div>

        <div className="order-total">
          <strong>Total:</strong> ₹{order.total}
        </div>

        <a
          href={`https://wa.me/918306939006?text=Hello, I have completed payment for Order ID ${order.order_code}`}
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

      {/* ORDER DETAILS */}

      <div className="order-details-box">
        <h3>Order Items</h3>

        {order.order_items?.map((item) => (
          <div key={item.id} className="order-item-row">
            <img
              src={item.products?.image}
              alt=""
              className="product-img"
            />

            <div className="item-info">
              <div>{item.products?.name}</div>
              <small>Qty: {item.qty}</small>
            </div>

            <div className="item-price">
              ₹{item.price}
            </div>
          </div>
        ))}

        <hr />

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{order.total - order.shipping_price}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>₹{order.shipping_price}</span>
        </div>

        <div className="summary-row total">
          <strong>Total</strong>
          <strong>₹{order.total}</strong>
        </div>
      </div>
    </div>
  );
}
