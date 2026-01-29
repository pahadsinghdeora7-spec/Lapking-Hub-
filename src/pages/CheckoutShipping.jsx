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
        .eq("status", true)
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
      alert("Please select a courier service to continue");
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
        Loading delivery options...
      </p>
    );
  }

  return (
    <div className="checkout-shipping">

      {/* HEADER */}
      <h2>🚚 Choose Delivery Method</h2>

      <p className="shipping-subtext">
        Select a courier company based on delivery speed and charges.
      </p>

      {/* IMPORTANT NOTE */}
      <div className="shipping-note">
        💡 <b>Delivery charge depends on the selected courier company.</b>
        <br />
        Faster delivery may cost more.
      </div>

      {/* COURIER LIST */}
      {couriers.map((c) => (
        <div
          key={c.id}
          className={`courier-option ${
            selected?.id === c.id ? "active" : ""
          }`}
          onClick={() => setSelected(c)}
        >
          <div className="courier-left">
            <strong>🚚 {c.name}</strong>

            {c.days && (
              <div className="courier-days">
                ⏱ Estimated delivery: {c.days}
              </div>
            )}
          </div>

          <div className="courier-price">
            ₹{c.price}
          </div>
        </div>
      ))}

      {/* BUTTON */}
      <button
        className="continue-btn"
        onClick={handleContinue}
      >
        Continue to Payment →
      </button>

      {/* TRUST TEXT */}
      <p className="shipping-safe">
        🔒 Courier partner details are verified by LapkingHub
      </p>
    </div>
  );
    }
