export default function Payment() {
  const [payment, setPayment] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPayment() {
      try {
        const { data, error } = await window.supabase
          .from("payment_settings")
          .select("*")
          .eq("status", true)
          .limit(1)
          .single();

        if (!error) {
          setPayment(data);
        }

        setLoading(false);
      } catch (err) {
        console.log("Payment error:", err);
        setLoading(false);
      }
    }

    loadPayment();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading payment...</div>;
  }

  if (!payment) {
    return <div style={{ padding: 20 }}>Payment not available</div>;
  }

  const message = encodeURIComponent(
    "Hello LapkingHub 👋\nI have placed an order. Please confirm."
  );

  return (
    <div className="checkout-container">

      <div className="checkout-steps">
        ✔ Address → ✔ Shipping → 💳 Payment
      </div>

      <div className="card">

        <h3>💳 Payment</h3>

        <div className="payment-box">

          <div className="upi-box">
            <b>UPI ID</b>
            <p>{payment.upi_id}</p>
          </div>

          {payment.qr_image && (
            <img
              src={payment.qr_image}
              alt="QR"
              style={{ width: 200, margin: "15px auto" }}
            />
          )}

          <p className="payment-note">{payment.note}</p>

          <a
            href={`https://wa.me/91${payment.whatsapp}?text=${message}`}
            className="whatsapp-pay-btn"
          >
            📲 Continue on WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}
