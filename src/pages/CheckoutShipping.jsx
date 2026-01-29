import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./CheckoutShipping.css";

export default function CheckoutShipping() {
  const navigate = useNavigate();

  const [couriers, setCouriers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCouriers() {
      const { data, error } = await supabase
        .from("couriers")
        .select("*")
        .eq("status", true) // ✅ IMPORTANT
        .order("price", { ascending: true });

      if (!error && data) {
        setCouriers(data);
      }

      setLoading(false);
    }

    loadCouriers();
  }, []);

  function handleContinue() {
    if (!selected) {
      alert("Please select courier company");
      return;
    }

    localStorage.setItem(
      "selected_courier",
      JSON.stringify(selected)
    );

    navigate("/checkout/payment");
  }

  if (loading) {
    return (
      <p style={{ textAlign: "center" }}>
        Loading courier options...
      </p>
    );
  }

  return (
    <div className="checkout-shipping">

      <h2>Select Courier</h2>

      {couriers.map((c) => (
        <div
          key={c.id}
          className={`courier-option ${
            selected?.id === c.id ? "active" : ""
          }`}
          onClick={() => setSelected(c)}
        >
          <div>
            <strong>{c.name}</strong>
            {c.days && (
              <div style={{ fontSize: 12, color: "#666" }}>
                Delivery in {c.days}
              </div>
            )}
          </div>

          <span>₹{c.price}</span>
        </div>
      ))}

      <button
        className="continue-btn"
        onClick={handleContinue}
      >
        Continue to Payment →
      </button>
    </div>
  );
}
