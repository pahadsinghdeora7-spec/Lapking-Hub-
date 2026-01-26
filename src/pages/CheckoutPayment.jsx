import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CheckoutPayment() {

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  // demo order data (tumhare cart se later auto aayega)
  const order = {
    product: "Keyboard",
    qty: 1,
    subtotal: 500,
    shipping: 149,
    total: 649,
    courier: "BlueDart"
  };

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  async function fetchPaymentSettings() {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("status", true)
      .single();

    if (!error) {
      setPayment(data);
    }
    setLoading(false);
  }

  function openWhatsapp() {
    const msg = `
New Order - LapkingHub

Product: ${order.product}
Qty: ${order.qty}

Subtotal: ₹${order.subtotal}
Shipping (${order.courier}): ₹${order.shipping}
Total: ₹${order.total}

Please confirm my order.
    `;

    window.open(
      `https://wa.me/91${payment.whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading payment...</div>;
  }

  if (!payment) {
    return <div style={{ padding: 20 }}>Payment not available</div>;
  }

  return (
    <div className="checkout-container">

      {/* STEPS */}
      <div className="checkout-steps">
        ✔ Address → ✔ Shipping → <b>Payment</b>
      </div>

      {/* PAYMENT CARD */}
      <div className="card">
        <h3>💳 Payment</h3>

        <div className="payment-box">
          <p><b>Payment Method:</b> WhatsApp Order Confirmation</p>

          <p>
            After clicking Pay Now, our team will confirm your order on WhatsApp.
          </p>

          <div className="upi-box">
            <p><b>Support WhatsApp</b></p>
            <p>📱 {payment.whatsapp}</p>
          </div>
        </div>

        <div className="total-pay">
          Total Amount: <b>₹{order.total}</b>
        </div>

        <button className="pay-btn" onClick={openWhatsapp}>
          Confirm Order on WhatsApp →
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <div className="card">
        <h3>📦 Order Summary</h3>

        <div className="summary-row">
          <span>{order.product} × {order.qty}</span>
          <span>₹{order.subtotal}</span>
        </div>

        <div className="summary-row">
          <span>Shipping ({order.courier})</span>
          <span>₹{order.shipping}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

    </div>
  );
}
