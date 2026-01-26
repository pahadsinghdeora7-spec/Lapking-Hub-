import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Payment() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayment = async () => {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .eq("status", true)
        .limit(1)
        .single();

      if (!error) {
        setPayment(data);
      }

      setLoading(false);
    };

    loadPayment();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Loading payment details...
      </div>
    );
  }

  if (!payment) {
    return (
      <div style={{ padding: 20 }}>
        Payment not available
      </div>
    );
  }

  return (
    <div className="payment-page">

      <h2>Payment</h2>

      <div className="card">
        <p><b>UPI ID</b></p>
        <p>{payment.upi_id}</p>
      </div>

      <div className="card">
        <p><b>WhatsApp Order</b></p>
        <a
          href={`https://wa.me/${payment.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="primary-btn"
        >
          Continue on WhatsApp
        </a>
      </div>

      {payment.note && (
        <p style={{ marginTop: 10, fontSize: 13 }}>
          {payment.note}
        </p>
      )}

    </div>
  );
}
