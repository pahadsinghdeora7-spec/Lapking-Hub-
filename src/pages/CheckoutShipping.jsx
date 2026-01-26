<div className="checkout-container">

  {/* ================= STEP INDICATOR ================= */}
  <div className="checkout-steps">
    <span className="done">✔ Address</span>
    <span className="active">🚚 Shipping</span>
    <span>💳 Payment</span>
  </div>

  {/* ================= TRUST LINE ================= */}
  <div className="trust-line">
    🔒 Secure Checkout &nbsp; | &nbsp;
    🚚 Verified Couriers &nbsp; | &nbsp;
    📦 Safe Packaging
  </div>


  {/* ================= ORDER SUMMARY ================= */}
  <div className="card">
    <h3>📋 Order Summary</h3>

    {cart.map((item, i) => (
      <div key={i} className="summary-row">
        <span>{item.name} × {item.qty}</span>
        <span>₹{item.price * item.qty}</span>
      </div>
    ))}

    <hr />

    <div className="summary-row">
      <span>Subtotal</span>
      <span>₹{subtotal}</span>
    </div>

    <div className="summary-row">
      <span>Shipping</span>
      <span>₹{shipping}</span>
    </div>

    <div className="summary-total">
      <span>Total Payable</span>
      <span>₹{total}</span>
    </div>
  </div>


  {/* ================= MODEL PART ================= */}
  <div className="card">
    <label>🧾 Model & Part Number (Recommended)</label>

    <input
      type="text"
      placeholder="e.g. Dell Latitude 7400 / 0CMX1D"
    />

    <small>
      Helps us deliver the correct spare part
    </small>
  </div>


  {/* ================= COURIER ================= */}
  <div className="card">
    <h3>🚚 Select Courier</h3>

    {couriers.map((c) => (
      <div
        key={c.id}
        className={`courier-box ${
          selectedCourier?.id === c.id ? "active" : ""
        }`}
        onClick={() => setSelectedCourier(c)}
      >
        <input
          type="radio"
          checked={selectedCourier?.id === c.id}
          readOnly
        />

        <div>
          <b>{c.name}</b>
          <p>{c.days}</p>
        </div>

        <span>₹{c.price}</span>
      </div>
    ))}

    <small className="courier-note">
      ⏱ Delivery time may vary depending on location
    </small>
  </div>


  {/* ================= PAYMENT BUTTON ================= */}
  <div className="payment-info">
    💡 You will be redirected to payment page
  </div>

  <button
    className="primary-btn"
    onClick={() => {
      localStorage.setItem(
        "shipping",
        JSON.stringify(selectedCourier)
      );
      window.location.hash = "#/checkout/payment";
    }}
  >
    Continue to Payment →
  </button>

</div>
