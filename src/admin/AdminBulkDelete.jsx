import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminBulkDelete() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // ===============================
  // LOAD PRODUCTS
  // ===============================
  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
  };

  // ===============================
  // LOAD CATEGORIES
  // ===============================
  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  };

  // ===============================
  // SELECT SINGLE
  // ===============================
  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  // ===============================
  // SELECT ALL
  // ===============================
  const toggleAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map(p => p.id));
    }
  };

  // ===============================
  // DELETE SELECTED
  // ===============================
  const deleteSelected = async () => {
    if (selected.length === 0) {
      alert("Please select products first");
      return;
    }

    if (!window.confirm(`${selected.length} products delete karna hai?`)) return;

    setLoading(true);

    await supabase
      .from("products")
      .delete()
      .in("id", selected);

    setSelected([]);
    loadProducts();
    setLoading(false);
  };

  // ===============================
  // DELETE BY CATEGORY
  // ===============================
  const deleteByCategory = async () => {
    if (!categoryId) return alert("Category select karo");

    if (!window.confirm("Is category ke sab products delete ho jayenge")) return;

    setLoading(true);

    await supabase
      .from("products")
      .delete()
      .eq("category_id", categoryId);

    loadProducts();
    setLoading(false);
  };

  // ===============================
  // DELETE LOW STOCK
  // ===============================
  const deleteLowStock = async () => {
    if (!window.confirm("Low stock products delete karna hai?")) return;

    setLoading(true);

    await supabase
      .from("products")
      .delete()
      .lte("stock", 5);

    loadProducts();
    setLoading(false);
  };

  return (
    <div className="admin-page">

      <h2>Bulk Delete Products</h2>

      {/* ================= ACTION CARD ================= */}
      <div className="admin-card">

        <div className="form-grid">

          {/* CATEGORY DELETE */}
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            className="delete-btn"
            onClick={deleteByCategory}
            disabled={loading}
          >
            Delete Category Products
          </button>

          {/* LOW STOCK */}
          <button
            className="delete-btn"
            onClick={deleteLowStock}
            disabled={loading}
          >
            Delete Low Stock (≤ 5)
          </button>

        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="admin-card">

        <div style={{ marginBottom: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={selected.length === products.length && products.length > 0}
              onChange={toggleAll}
            />{" "}
            Select All
          </label>

          <button
            onClick={deleteSelected}
            className="delete-btn"
            style={{ marginLeft: 15 }}
            disabled={loading}
          >
            Delete Selected ({selected.length})
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}
