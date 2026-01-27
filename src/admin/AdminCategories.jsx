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

  // ================= FETCH =================
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: false });

    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= ADD =================
  const addCategory = async () => {
    if (!name.trim()) {
      alert("Category name required hai");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("categories").insert([
      {
        name: name.trim(),
        h1: h1.trim(),
        description: description.trim(),
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();
    fetchCategories();
    alert("Category added successfully ✅");
  };

  // ================= EDIT =================
  const editCategory = (cat) => {
    setEditId(cat.id);
    setName(cat.name || "");
    setH1(cat.h1 || "");
    setDescription(cat.description || "");
  };

  // ================= UPDATE =================
  const updateCategory = async () => {
    if (!editId) return;

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .update({
        name: name.trim(),
        h1: h1.trim(),
        description: description.trim(),
      })
      .eq("id", editId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();
    fetchCategories();
    alert("Category updated successfully ✅");
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setH1("");
    setDescription("");
  };

  return (
    <div className="admin-category">

      {/* TITLE */}
      <div className="page-title">
        <h2>📁 Categories (SEO Enabled)</h2>
        <p>H1 & description Google SEO ke liye</p>
      </div>

      {/* FORM */}
      <div className="category-card">
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

        <button
          className="primary-btn"
          onClick={editId ? updateCategory : addCategory}
          disabled={loading}
        >
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

      {/* TABLE */}
      <div className="category-table">
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

            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
        }
