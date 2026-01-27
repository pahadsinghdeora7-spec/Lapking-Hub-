import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import "./AdminCategories.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- FETCH ----------------
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: false });

    setCategories(data || []);
  };

  // ---------------- ADD ----------------
  const addCategory = async () => {
    if (!name.trim()) {
      alert("Category name required hai");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .insert([{ name }]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setName("");
      fetchCategories();
    }
  };

  // ---------------- DELETE ----------------
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          📁 Categories
        </h2>
        <p className="text-sm text-gray-500">
          Manage all product categories
        </p>
      </div>

      {/* ADD CATEGORY */}
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h4 className="font-semibold mb-3 text-gray-700">
          Add New Category
        </h4>

        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={addCategory}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Add Category"}
          </button>
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-400"
                >
                  No categories found
                </td>
              </tr>
            )}

            {categories.map((c) => (
              <tr
                key={c.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{c.id}</td>
                <td className="p-3 font-medium text-gray-800">
                  {c.name}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-red-600 font-medium hover:underline"
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
