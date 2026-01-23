import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function Checkout() {
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    model_part: "",
  });

  const cartTotal = 0; // tumhara cart total yaha already hoga

  // 🔹 fetch couriers
  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    const { data } = await supabase
      .from("couriers")
      .select("*")
      .eq("status", true)
      .order("price");

    setCouriers(data || []);
  };

  // 🔹 place order
  const placeOrder = async () => {
    if (!selectedCourier) {
      alert("Please select courier");
      return;
    }

    const totalAmount =
      Number(cartTotal) + Number(selectedCourier.price);

    const { error } = await supabase.from("orders").insert([
      {
        name: form.name,
        phone: form.phone,
        address: form.address,
        model_part: form.model_part,

        shipping_name: selectedCourier.name,
        shipping_price: selectedCourier.price,

        total: totalAmount,
        payment_method: "COD",
        payment_status: "pending",
        order_status: "new",
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Order placed successfully ✅");
    }
  };

  return (
    <div className="checkout">

      <h2>Delivery Details</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <textarea
        placeholder="Address"
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />

      <input
        placeholder="Model / Part"
        value={form.model_part}
        onChange={(e) =>
          setForm({ ...form, model_part: e.target.value })
        }
      />

      <hr />

      <h3>Select Courier</h3>

      {couriers.map((c) => (
        <label key={c.id} style={{ display: "block", marginBottom: 10 }}>
          <input
            type="radio"
            name="courier"
            onChange={() => setSelectedCourier(c)}
          />
          {c.name} — ₹{c.price}
        </label>
      ))}

      <hr />

      <h3>
        Total: ₹
        {selectedCourier
          ? cartTotal + selectedCourier.price
          : cartTotal}
      </h3>

      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
      }
