import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CheckoutPayment() {
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("status", true)
      .single();

    setPayment(data);
  };

  if (!payment) return <p style={{ padding: 20 }}>Loading payment...</p>;

  return (
    <div className="payment-page">

      <h2>Payment</h2>

      {/* ✅ QR IMAGE */}
      {payment.qr_image && (
        <div style={{
          background: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          textAlign: "center"
        }}>
          <img
            src={payment.qr_image}
            alt="QR Code"
            style={{
              width: 220,
              maxWidth: "100%",
              borderRadius: 8
            }}
          />
        </div>
      )}

      {/* ✅ UPI */}
      <div className="card">
        <b>UPI ID</b>
        <p>{payment.upi_id}</p>
      </div>

      {/* ✅ WhatsApp */}
      <div className="card">
        <b>WhatsApp Order</b>
        <a
          href={`https://wa.me/91${payment.whatsapp}`}
          className="btn"
          target="_blank"
          rel="noreferrer"
        >
          Continue on WhatsApp
        </a>
      </div>

      {/* ✅ NOTE */}
      {payment.note && (
        <p style={{ marginTop: 10, color: "#666" }}>
          {payment.note}
        </p>
      )}

    </div>
  );
}
