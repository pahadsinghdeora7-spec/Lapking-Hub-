import "./CheckoutPayment.css";

export default function CheckoutPayment() {
  const total = 1349;

  return (
    <div className="payment-wrapper">

      <h2 className="payment-title">
        🔒 Secure UPI Payment
      </h2>

      {/* Merchant */}
      <div className="merchant-box">
        <div className="merchant-logo">K</div>
        <div className="merchant-name">King Metals</div>
      </div>

      {/* QR */}
      <div className="qr-card">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=upi://pay?pa=kingmetals517@okhdfcbank&pn=King%20Metals&am=1349&cu=INR"
          alt="UPI QR"
        />
        <p className="scan-text">
          Scan to pay using any UPI app
        </p>
      </div>

      {/* UPI ID */}
      <div className="upi-box">
        <div className="upi-label">UPI ID</div>
        <div className="upi-id">kingmetals517@okhdfcbank</div>
      </div>

      {/* UPI Apps */}
      <div className="upi-apps">
        <div className="upi-app">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Google_Pay_Logo.svg" />
          <span>Google Pay</span>
        </div>

        <div className="upi-app">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/PhonePe_Logo.svg" />
          <span>PhonePe</span>
        </div>

        <div className="upi-app">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" />
          <span>Paytm</span>
        </div>
      </div>

      {/* Pay Button */}
      <button className="pay-btn">
        Pay ₹{total}
      </button>

    </div>
  );
}
