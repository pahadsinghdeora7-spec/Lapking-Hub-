import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminCategories.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [seoH1, setSeoH1] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
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

  const addCategory = async () => {
    if (!name.trim()) {
      alert("Category name required hai");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("categories").insert([
      {
        name,
        seo_h1: seoH1,
        seo_description: seoDesc
      }
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setName("");
      setSeoH1("");
      setSeoDesc("");
      fetchCategories();
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <div className="admin-category">

      <div className="cat-header">
        <h2>📁 Categories (SEO Enabled)</h2>
        <p>H1 & description Google ke liye</p>
      </div>

      <div className="cat-card">
        <h4>Add Category</h4>

        <div className="cat-form">
          <input
            placeholder="Category name (Keyboard)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="SEO H1 (Buy Keyboard Online in India)"
            value={seoH1}
            onChange={(e) => setSeoH1(e.target.value)}
          />

          <textarea
            placeholder="SEO description (150–160 characters)"
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
          />

          <button onClick={addCategory}>
            {loading ? "Saving..." : "Add Category"}
          </button>
        </div>
      </div>

      <div className="cat-card">
        <table className="cat-table">
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
                <td>{c.seo_h1 || "-"}</td>
                <td>
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
