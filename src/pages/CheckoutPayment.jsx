import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = 149;
  const total = subtotal + shipping;

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    const { data } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("status", true)
      .limit(1)
      .single();

    if (data) setPayment(data);
  };

  if (!payment) return null;

  return (
    <div style={{ padding: 14, background: "#f6f8fb", minHeight: "100vh" }}>

      <h2 style={{ marginBottom: 12 }}>Payment</h2>

      {/* QR CARD */}
      {payment.qr_image && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 15,
            textAlign: "center",
            marginBottom: 15,
          }}
        >
          <img
            src={payment.qr_image}
            alt="QR"
            style={{
              width: 180,
              height: 180,
              objectFit: "contain",
              marginBottom: 8,
            }}
          />
          <div style={{ fontSize: 13, color: "#666" }}>
            Scan QR to pay via UPI
          </div>
        </div>
      )}

      {/* UPI ID */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 12,
          marginBottom: 15,
          fontSize: 14,
        }}
      >
        <strong>UPI ID</strong>
        <div style={{ marginTop: 4 }}>{payment.upi_id}</div>
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          Back
        </button>

        <button
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#0b5cff",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Pay ₹{total}
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <h3 style={{ marginBottom: 10 }}>Order Summary</h3>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 12,
        }}
      >
        {cart.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 10,
              alignItems: "center",
            }}
          >
            <img
              src={item.image}
              alt=""
              style={{
                width: 50,
                height: 50,
                borderRadius: 6,
                objectFit: "cover",
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: "#777" }}>
                Qty: {item.qty}
              </div>
            </div>

            <div style={{ fontWeight: 600 }}>
              ₹{item.price * item.qty}
            </div>
          </div>
        ))}

        <hr />

        <div style={{ fontSize: 14, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
        }
