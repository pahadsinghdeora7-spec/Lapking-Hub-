import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminCategories.css";

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

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: false });

    setCategories(data || []);
  };

  // ADD / UPDATE
  const saveCategory = async () => {
    if (!name.trim()) {
      alert("Category name required hai");
      return;
    }

    setLoading(true);

    if (editId) {
      // UPDATE
      await supabase
        .from("categories")
        .update({ name, h1, description })
        .eq("id", editId);
    } else {
      // INSERT
      await supabase.from("categories").insert([
        {
          name,
          h1,
          description,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      ]);
    }

    setLoading(false);
    resetForm();
    fetchCategories();
  };

  const resetForm = () => {
    setName("");
    setH1("");
    setDescription("");
    setEditId(null);
  };

  const editCategory = (cat) => {
    setEditId(cat.id);
    setName(cat.name || "");
    setH1(cat.h1 || "");
    setDescription(cat.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category permanently?")) return;

    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <div className="admin-page">

      <div className="page-head">
        <h2>📁 Categories (SEO Enabled)</h2>
        <p>H1 & description Google ke liye</p>
      </div>

      {/* FORM */}
      <div className="card-box">
        <h4>{editId ? "Edit Category" : "Add Category"}</h4>

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

        <div className="form-actions">
          <button className="save-btn" onClick={saveCategory}>
            {loading
              ? "Saving..."
              : editId
              ? "Update Category"
              : "Add Category"}
          </button>

          {editId && (
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="card-box">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SEO H1</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.h1 || "-"}</td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => editCategory(c)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
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
