const [courier, setCourier] = useState("bluedart");

return (
  <div className="checkout-container">

    {/* ================= ORDER SUMMARY ================= */}
    <div className="card">
      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹2550</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span>
          {courier === "bluedart" && "₹149"}
          {courier === "dtdc" && "₹79"}
          {courier === "delhivery" && "₹99"}
        </span>
      </div>

      <div className="summary-total">
        <span>Total</span>
        <span>
          ₹
          {courier === "bluedart"
            ? 2699
            : courier === "dtdc"
            ? 2629
            : 2649}
        </span>
      </div>
    </div>

    {/* ================= MODEL PART ================= */}
    <div className="card">
      <label>Please enter your Model & Part Number</label>

      <input
        type="text"
        placeholder="e.g. Dell Latitude 7400 / 0CMX1D"
      />

      <small>
        To avoid your product being wrongly delivered
      </small>
    </div>

    {/* ================= COURIER ================= */}
    <div className="card">
      <h3>Select Courier</h3>

      <div
        className={`courier-box ${courier === "bluedart" ? "active" : ""}`}
        onClick={() => setCourier("bluedart")}
      >
        <input type="radio" checked={courier === "bluedart"} readOnly />
        <div>
          <b>BlueDart</b>
          <p>2–4 days</p>
        </div>
        <span>₹149</span>
      </div>

      <div
        className={`courier-box ${courier === "dtdc" ? "active" : ""}`}
        onClick={() => setCourier("dtdc")}
      >
        <input type="radio" checked={courier === "dtdc"} readOnly />
        <div>
          <b>DTDC</b>
          <p>4–6 days</p>
        </div>
        <span>₹79</span>
      </div>

      <div
        className={`courier-box ${courier === "delhivery" ? "active" : ""}`}
        onClick={() => setCourier("delhivery")}
      >
        <input type="radio" checked={courier === "delhivery"} readOnly />
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
      onClick={() => {
        window.location.hash = "#/checkout/payment";
      }}
    >
      Continue to Payment →
    </button>

  </div>
);
