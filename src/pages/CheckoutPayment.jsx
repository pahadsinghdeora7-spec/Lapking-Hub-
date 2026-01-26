import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const total = 2699;

  return (
    <div className="payment-page">

      {/* STEPS */}
      <div className="checkout-steps">
        <div className="done">✔ Address</div>
        <div className="done">✔ Shipping</div>
        <div className="active">3 Payment</div>
      </div>

      {/* PAYMENT CARD */}
      <div className="payment-card">
        <h3>Payment</h3>

        {/* UPI ID */}
        <div className="upi-box">
          <span>UPI ID</span>
          <strong>9873670361@jio</strong>
        </div>

        <p className="scan-text">Scan this QR to pay via UPI</p>

        {/* QR */}
        <div className="qr-box">
          <img
            src="https://YOUR-SUPABASE-URL/storage/v1/object/public/payment/upi-qr.png"
            alt="UPI QR"
          />
        </div>

        {/* AMOUNT */}
        <div className="amount-box">
          <p>Total Amount</p>
          <h2>₹{total}</h2>
        </div>

        <p className="note">
          Pay using any UPI app (GPay, PhonePe, Paytm).  
          After payment, your order will be created with
          <b> Payment Pending</b> status.
        </p>

        {/* BUTTON */}
        <div className="payment-buttons">
          <button className="back-btn">Back</button>
          <button
            className="pay-btn"
            onClick={() => {
              window.location.href = "/order/success";
            }}
          >
            Pay ₹{total}
          </button>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="order-summary">
        <h4>Order Summary</h4>

        <div className="item">
          <span>
            Acer Aspire 5 Bottom Base Cover
            <br />
            Qty: 1
          </span>
          <strong>₹2,550</strong>
        </div>

        <div className="line" />
        <div className="row">
          <span>Subtotal</span>
          <span>₹2,550</span>
        </div>

        <div className="row">
          <span>Shipping (BlueDart)</span>
          <span>₹149</span>
        </div>

        <div className="total-row">
          <span>Total</span>
          <strong>₹2,699</strong>
        </div>
      </div>

    </div>
  );
}
