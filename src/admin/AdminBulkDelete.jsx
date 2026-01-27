import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminBulkDelete.css";

export default function AdminBulkDelete() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [category, setCategory] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  };

  const fetchProducts = async (cat = "") => {
    let query = supabase.from("products").select("*");

    if (cat) {
      query = query.eq("category_slug", cat);
    }

    const { data } = await query.order("id", { ascending: false });
    setProducts(data || []);
    setSelectedIds([]);
  };

  // ================= CATEGORY CHANGE =================
  const handleCategory = (value) => {
    setCategory(value);
    fetchProducts(value);
  };

  // ================= SELECT =================
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectAll = (checked) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // ================= DELETE =================
  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Select at least one product");
      return;
    }

    const confirm = window.confirm(
      `Delete ${selectedIds.length} products?`
    );

    if (!confirm) return;

    await supabase
      .from("products")
      .delete()
      .in("id", selectedIds);

    fetchProducts(category);
  };

  return (
    <div className="bulk-page">

      <h2>Bulk Delete Products</h2>

      {/* FILTER */}
      <div className="bulk-filter">

        <select
          value={category}
          onChange={(e) => handleCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="select-all">
          <input
            type="checkbox"
            checked={
              products.length > 0 &&
              selectedIds.length === products.length
            }
            onChange={(e) => selectAll(e.target.checked)}
          />
          <span>Select All</span>
        </div>

      </div>

      {/* TABLE */}
      <div className="bulk-table">
        <table>
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
                <td colSpan="4" className="empty-text">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>

                  <td>{p.name}</td>
                  <td>₹{p.price || 0}</td>
                  <td>{p.stock || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        className="bulk-delete-btn"
        onClick={deleteSelected}
      >
        Delete Selected Products
      </button>

    </div>
  );
}
