import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function AdminCouriers() {
  const [couriers, setCouriers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    status: true,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 ONLY ADMIN ACCESS
  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== "pahadsinghdeora23@gmail.com") {
      alert("Unauthorized access");
      window.location.href = "/";
      return;
    }

    load();
  };

  // =============================
  // LOAD COURIERS
  // =============================
  const load = async () => {
    const { data, error } = await supabase
      .from("couriers")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setCouriers(data || []);
    }

    setLoading(false);
  };

  // =============================
  // SAVE
  // =============================
  const save = async () => {
    if (!form.name || !form.price) {
      alert("Courier name & price required");
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price), // ✅ FIX
      status: form.status,
    };

    let res;

    if (editId) {
      res = await supabase
        .from("couriers")
        .update(payload)
        .eq("id", editId);
    } else {
      res = await supabase.from("couriers").insert([payload]);
    }

    if (res.error) {
      alert(res.error.message);
      return;
    }

    setForm({ name: "", price: "", status: true });
    setEditId(null);
    load();
  };

  // =============================
  // EDIT
  // =============================
  const edit = (c) => {
    setEditId(c.id);
    setForm({
      name: c.name,
      price: c.price,
      status: c.status,
    });
  };

  // =============================
  // DELETE
  // =============================
  const remove = async (id) => {
    if (!window.confirm("Delete courier?")) return;

    const { error } = await supabase
      .from("couriers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      load();
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading couriers...</p>;

  return (
    <div className="admin-page">
      <h2>🚚 Couriers</h2>

      {/* FORM */}
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
          type="number"
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

      {/* TABLE */}
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
