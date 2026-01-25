export default function CheckoutShipping() {
  const [courier, setCourier] = React.useState("bluedart");

  const subtotal = 2550;

  const shippingPrice =
    courier === "bluedart"
      ? 149
      : courier === "dtdc"
      ? 79
      : 99;

  const total = subtotal + shippingPrice;

  return (
    <div className="checkout-container">

      {/* ================= ORDER SUMMARY ================= */}
      <div className="card">
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span>
            Shipping
            <small style={{ display: "block", color: "#777" }}>
              via {courier === "bluedart"
                ? "BlueDart"
                : courier === "dtdc"
                ? "DTDC"
                : "Delhivery"}
            </small>
          </span>
          <span>₹{shippingPrice}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* ================= MODEL & PART ================= */}
      <div className="card">
        <label className="field-label">
          Please enter your Model & Part Number
        </label>

        <input
          type="text"
          className="text-input"
          placeholder="e.g. Dell Latitude 7400 / 0CMX1D"
        />

        <small className="hint-text">
          To avoid your product being wrongly delivered
        </small>
      </div>

      {/* ================= COURIER ================= */}
      <div className="card">
        <h3>Select Courier</h3>

        {/* BLUEDART */}
        <div
          className={`courier-box ${
            courier === "bluedart" ? "active" : ""
          }`}
          onClick={() => setCourier("bluedart")}
        >
          <input
            type="radio"
            checked={courier === "bluedart"}
            readOnly
          />
          <div>
            <b>BlueDart</b>
            <p>2–4 days</p>
          </div>
          <span>₹149</span>
        </div>

        {/* DTDC */}
        <div
          className={`courier-box ${
            courier === "dtdc" ? "active" : ""
          }`}
          onClick={() => setCourier("dtdc")}
        >
          <input
            type="radio"
            checked={courier === "dtdc"}
            readOnly
          />
          <div>
            <b>DTDC</b>
            <p>4–6 days</p>
          </div>
          <span>₹79</span>
        </div>

        {/* DELHIVERY */}
        <div
          className={`courier-box ${
            courier === "delhivery" ? "active" : ""
          }`}
          onClick={() => setCourier("delhivery")}
        >
          <input
            type="radio"
            checked={courier === "delhivery"}
            readOnly
          />
          <div>
            <b>Delhivery</b>
            <p>3–5 days</p>
          </div>
          <span>₹99</span>
        </div>
      </div>

      {/* ================= BUTTON ================= */}
      <button
        className="primary-btn"
        onClick={() => navigate("/checkout/payment")}
      >
        Continue to Payment →
      </button>

    </div>
  );
        }
