import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminCouriers() {
  const [couriers, setCouriers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    status: true,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("couriers")
      .select("*")
      .order("id", { ascending: false });

    setCouriers(data || []);
  };

  const save = async () => {
    if (!form.name || !form.price) {
      alert("Name & price required");
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

    setForm({ name: "", price: "", status: true });
    setEditId(null);
    load();
  };

  const edit = (c) => {
    setEditId(c.id);
    setForm({
      name: c.name,
      price: c.price,
      status: c.status,
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete courier?")) return;
    await supabase.from("couriers").delete().eq("id", id);
    load();
  };

  return (
    <div className="admin-page">
      <h2>Couriers</h2>

      <div className="card">
        <h3>{editId ? "Edit Courier" : "Add Courier"}</h3>

        <input
          placeholder="Courier name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <label style={{ display: "flex", gap: 8 }}>
          <input
            type="checkbox"
            checked={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.checked })
            }
          />
          Active
        </label>

        <button onClick={save}>
          {editId ? "Update Courier" : "Add Courier"}
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {couriers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>₹{c.price}</td>
                <td>{c.status ? "Active" : "Disabled"}</td>
                <td>
                  <button onClick={() => edit(c)}>Edit</button>
                  <button onClick={() => remove(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
    }
