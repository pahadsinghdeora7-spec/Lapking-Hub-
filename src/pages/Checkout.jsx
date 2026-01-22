import React, { useState } from "react";
import "./Checkout.css";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    modelPart: "", // optional
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {
    if (!form.name || !form.mobile || !form.address) {
      alert("Please fill required fields");
      return;
    }

    const message = `
🧾 *New Order – Lapking Hub*

👤 Name: ${form.name}
📞 Mobile: ${form.mobile}
🏠 Address: ${form.address}
🏙 City: ${form.city}
📮 Pincode: ${form.pincode}

💻 Model / Part No:
${form.modelPart || "Not provided"}

Please confirm order.
`;

    window.open(
      `https://wa.me/919873670361?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-box">
        <input
          type="text"
          placeholder="Full Name *"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="tel"
          placeholder="Mobile Number *"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
        />

        <textarea
          placeholder="Full Address *"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <div className="row">
          <input
            type="text"
            placeholder="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Pincode"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
          />
        </div>

        {/* OPTIONAL FIELD */}
        <input
          type="text"
          placeholder="Model / Part Number (optional)"
          name="modelPart"
          value={form.modelPart}
          onChange={handleChange}
        />

        <p className="note">
          * If you are not sure, you can leave this blank. Our team will confirm
          on WhatsApp.
        </p>

        <button className="place-order" onClick={placeOrder}>
          Place Order on WhatsApp →
        </button>
      </div>
    </div>
  );
        }
