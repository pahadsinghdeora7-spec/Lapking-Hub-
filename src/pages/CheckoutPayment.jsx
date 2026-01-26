export default function Payment() {
  const [payment, setPayment] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPayment() {
      const { data } = await supabase
        .from("payment_settings")
        .select("*")
        .eq("status", true)
        .limit(1)
        .single();

      setPayment(data);
      setLoading(false);
    }

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

  const whatsappMessage = encodeURIComponent(
    "Hello LapkingHub 👋\n\nI have placed an order.\nPlease confirm my payment."
  );

  return (
    <div className="checkout-container">

      {/* STEP BAR */}
      <div className="checkout-steps">
        ✔ Address → ✔ Shipping → 💳 Payment
      </div>

      {/* PAYMENT CARD */}
      <div className="card">

        <h3>💳 Payment</h3>

        <div className="payment-box">

          <div className="upi-box">
            <b>UPI ID</b>
            <p>{payment.upi_id}</p>
          </div>

          <div className="qr-box">
            <img
              src={payment.qr_image}
              alt="QR Code"
              style={{ width: 200 }}
            />
          </div>

          <p className="payment-note">
            {payment.note}
          </p>

          <a
            href={`https://wa.me/91${payment.whatsapp}?text=${whatsappMessage}`}
            className="whatsapp-pay-btn"
          >
            📲 Continue on WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}
