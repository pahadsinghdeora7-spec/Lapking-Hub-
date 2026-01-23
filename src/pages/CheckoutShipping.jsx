// src/pages/CheckoutShipping.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "./CheckoutShipping.css";

export default function CheckoutShipping() {
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchShipping();
  }, []);

  async function fetchShipping() {
    const { data, error } = await supabase
      .from("shipping_methods")
      .select("*")
      .eq("active", true);

    if (!error) {
      setMethods(data || []);
    }
  }

  function continueNext() {
    if (!selected) {
      alert("Please select shipping method");
      return;
    }

    localStorage.setItem(
      "shipping",
      JSON.stringify(selected)
    );

    navigate("/checkout/review");
  }

  return (
    <div className="checkout-box">
      <h2>Choose Shipping Method</h2>

      {methods.map(item => (
        <div
          key={item.id}
          className={`ship-card ${
            selected?.id === item.id ? "active" : ""
          }`}
          onClick={() => setSelected(item)}
        >
          <div>
            <h4>{item.name}</h4>
            <p>{item.days}</p>
          </div>

          <strong>₹{item.price}</strong>
        </div>
      ))}

      <button className="next-btn" onClick={continueNext}>
        Continue to Review
      </button>
    </div>
  );
}
