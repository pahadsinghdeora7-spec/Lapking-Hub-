import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminCategories.css";

/* SLUG GENERATOR */
const makeSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [h1, setH1] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  /* FETCH */
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: false });

    setCategories(data || []);
  };

  /* ADD / UPDATE */
  const saveCategory = async () => {
    if (!name.trim()) {
      alert("Category name required");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      slug: makeSlug(name),
      h1,
      description,
    };

    let res;

    if (editId) {
      res = await supabase
        .from("categories")
        .update(payload)
        .eq("id", editId);
    } else {
      res = await supabase.from("categories").insert([payload]);
    }

    setLoading(false);

    if (res.error) {
      alert(res.error.message);
      return;
    }

    setName("");
    setH1("");
    setDescription("");
    setEditId(null);
    fetchCategories();
  };

  /* EDIT */
  const editCategory = (cat) => {
    setEditId(cat.id);
    setName(cat.name || "");
    setH1(cat.h1 || "");
    setDescription(cat.description || "");
  };

  /* DELETE */
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;

    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <div className="admin-box">

      <div className="title">
        <h2>📁 Categories (SEO Enabled)</h2>
        <p>H1 & description Google ke liye</p>
      </div>

      {/* FORM */}
      <div className="form-card">
        <input
          placeholder="Category name (Keyboard)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="SEO H1 (Buy Keyboard Online in India)"
          value={h1}
          onChange={(e) => setH1(e.target.value)}
        />

        <textarea
          placeholder="SEO description (150–160 characters)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={saveCategory} disabled={loading}>
          {loading
            ? "Saving..."
            : editId
            ? "Update Category"
            : "Add Category"}
        </button>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td className="slug">{c.slug}</td>
                <td>
                  <button className="edit" onClick={() => editCategory(c)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteCategory(c.id)}
                  >
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
