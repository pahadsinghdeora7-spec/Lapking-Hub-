import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function AdminCouriers() {
  const [couriers, setCouriers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    days: "",
    status: true
  });

  const [editId, setEditId] = useState(null);

  // ===============================
  // LOAD COURIERS
  // ===============================
  useEffect(() => {
    loadCouriers();
  }, []);

  async function loadCouriers() {
    const { data, error } = await supabase
      .from("couriers")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setCouriers(data || []);
    }
  }

  // ===============================
  // SAVE / UPDATE
  // ===============================
  async function saveCourier() {
    if (!form.name || !form.price || !form.days) {
      alert("Please enter courier name, delivery price and delivery timeline.");
      return;
    }

    if (editId) {
      await supabase
        .from("couriers")
        .update(form)
        .eq("id", editId);
    } else {
      await supabase.from("couriers").insert([form]);
    }

    setForm({
      name: "",
      price: "",
      days: "",
      status: true
    });

    setEditId(null);
    loadCouriers();
  }

  // ===============================
  // EDIT
  // ===============================
  function editCourier(c) {
    setEditId(c.id);
    setForm({
      name: c.name,
      price: c.price,
      days: c.days,
      status: c.status
    });
  }

  // ===============================
  // DELETE
  // ===============================
  async function removeCourier(id) {
    if (!window.confirm("Are you sure you want to remove this courier service?")) return;

    await supabase.from("couriers").delete().eq("id", id);
    loadCouriers();
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="admin-page">

      <h2>🚚 Courier Management</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Manage courier partners, delivery charges and estimated delivery timelines.
      </p>

      {/* ADD / EDIT */}
      <div className="card">
        <h3>{editId ? "Update Courier Service" : "Add New Courier Service"}</h3>

        <input
          placeholder="Courier company name (e.g. DTDC, Delhivery, Blue Dart)"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Delivery charge (₹)"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          placeholder="Estimated delivery time (e.g. 2–3 working days)"
          value={form.days}
          onChange={(e) =>
            setForm({ ...form, days: e.target.value })
          }
        />

        <label style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            type="checkbox"
            checked={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.checked })
            }
          />
          Enable this courier for customers
        </label>

        <button onClick={saveCourier}>
          {editId ? "Save Changes" : "Add Courier"}
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        <h3>Available Courier Services</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Courier Partner</th>
              <th>Delivery Charge</th>
              <th>Delivery Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {couriers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>₹{c.price}</td>
                <td>{c.days}</td>
                <td>{c.status ? "Active" : "Disabled"}</td>
                <td>
                  <button onClick={() => editCourier(c)}>
                    Edit
                  </button>
                  <button onClick={() => removeCourier(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
                       }
