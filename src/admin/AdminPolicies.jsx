import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    title: "",
    slug: "",
    content: "",
    status: true,
  });

  // ---------------- FETCH POLICIES ----------------
  const fetchPolicies = async () => {
    const { data } = await supabase
      .from("policies")
      .select("*")
      .order("id");

    setPolicies(data || []);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ---------------- SAVE / UPDATE ----------------
  const savePolicy = async () => {
    if (!form.title || !form.slug) {
      alert("Title aur slug required hai");
      return;
    }

    setLoading(true);

    if (form.id) {
      // update
      await supabase
        .from("policies")
        .update({
          title: form.title,
          slug: form.slug,
          content: form.content,
          status: form.status,
        })
        .eq("id", form.id);
    } else {
      // insert
      await supabase.from("policies").insert([
        {
          title: form.title,
          slug: form.slug,
          content: form.content,
          status: form.status,
        },
      ]);
    }

    setLoading(false);
    setForm({
      id: null,
      title: "",
      slug: "",
      content: "",
      status: true,
    });

    fetchPolicies();
    alert("Policy saved successfully");
  };

  // ---------------- EDIT ----------------
  const editPolicy = (p) => {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content || "",
      status: p.status,
    });
  };

  // ---------------- DELETE ----------------
  const deletePolicy = async (id) => {
    if (!window.confirm("Delete this policy?")) return;

    await supabase.from("policies").delete().eq("id", id);
    fetchPolicies();
  };

  return (
    <div className="admin-page">
      <h2>📜 Policy Management</h2>

      {/* FORM */}
      <div className="card">
        <h3>{form.id ? "Edit Policy" : "Add New Policy"}</h3>

        <input
          type="text"
          placeholder="Policy Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Slug (example: warranty, refund)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        <textarea
          rows="8"
          placeholder="Policy content (HTML allowed)"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <label style={{ marginTop: 10 }}>
          <input
            type="checkbox"
            checked={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.checked })
            }
          />{" "}
          Active
        </label>

        <br />

        <button
          className="btn blue"
          onClick={savePolicy}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Policy"}
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        <h3>All Policies</h3>

        {policies.length === 0 && <p>No policies added yet.</p>}

        {policies.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              padding: "8px 0",
            }}
          >
            <div>
              <b>{p.title}</b>
              <br />
              <small>/{p.slug}</small>
            </div>

            <div>
              <button
                className="btn"
                onClick={() => editPolicy(p)}
              >
                Edit
              </button>

              <button
                className="btn red"
                onClick={() => deletePolicy(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
