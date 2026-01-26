import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CheckoutPayment() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayment = async () => {
      const { data } = await supabase
        .from("payment_settings")
        .select("*")
        .eq("status", true)
        .limit(1)
        .single();

      setPayment(data);
      setLoading(false);
    };

    loadPayment();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading payment...</div>;

  if (!payment)
    return <div style={{ padding: 20 }}>Payment not available</div>;

  return (
    <div className="checkout-container">

      <div className="card">
        <h3>💳 Payment</h3>

        <p style={{ marginBottom: 10 }}>
          Complete your order via WhatsApp
        </p>

        <div className="payment-box">
          <p><b>WhatsApp Number</b></p>
          <p style={{ fontSize: 18, color: "#25D366" }}>
            +91 {payment.whatsapp}
          </p>

          <a
            href={`https://wa.me/91${payment.whatsapp}?text=Hello%20LapkingHub%2C%20I%20want%20to%20confirm%20my%20order`}
            target="_blank"
            rel="noreferrer"
            className="primary-btn"
            style={{ marginTop: 15 }}
          >
            Continue on WhatsApp →
          </a>

          {payment.note && (
            <p style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
              {payment.note}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
