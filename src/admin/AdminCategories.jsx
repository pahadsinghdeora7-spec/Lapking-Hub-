import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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
    if (!name) {
      alert("Category name required hai");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("categories").insert([{ name }]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Category added successfully");
      setName("");
      fetchCategories();
    }
  };

  // ---------------- DELETE ----------------
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;

    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">Categories</h2>

      {/* ADD CATEGORY */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3">
        <input
          className="border p-2 rounded w-full"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={addCategory}
          disabled={loading}
          className="bg-blue-600 text-white px-5 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>

      {/* CATEGORY LIST */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.id}</td>
                <td>{c.name}</td>
                <td>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-red-600 text-sm"
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
