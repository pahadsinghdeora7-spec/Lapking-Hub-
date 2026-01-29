import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutShipping.css";

export default function CheckoutShipping() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const couriers = [
    { name: "DTDC", price: 120 },
    { name: "Delhivery", price: 150 },
    { name: "Blue Dart", price: 220 }
  ];

  function continueNext() {
    if (!selected) {
      alert("Please select courier");
      return;
    }

    // ✅ MOST IMPORTANT LINE
    localStorage.setItem(
      "checkout_shipping",
      JSON.stringify({
        courier: selected.name,
        charge: selected.price
      })
    );

    navigate("/checkout/payment");
  }

  return (
    <div className="shipping-page">
      <h2>Select Courier</h2>

      {couriers.map((c) => (
        <div
          key={c.name}
          className={`courier-box ${
            selected?.name === c.name ? "active" : ""
          }`}
          onClick={() => setSelected(c)}
        >
          {c.name} — ₹{c.price}
        </div>
      ))}

      <button onClick={continueNext}>
        Continue to Payment →
      </button>
    </div>
  );
}
