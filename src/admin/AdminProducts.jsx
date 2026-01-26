import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // =====================
  // FETCH PRODUCTS
  // =====================
  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================
  // UI
  // =====================
  return (
    <div className="admin-page">

      <h2>Products</h2>

      {/* TOP BUTTONS */}
      <div className="top-actions">
        <button className="btn blue" onClick={() => setShowForm(false)}>
          📦 Product List
        </button>

        <button className="btn green" onClick={() => setShowForm(true)}>
          ➕ Add Product
        </button>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      {!showForm && (
        <div className="card">
          <h3>Product List</h3>

          {loading && <p>Loading products...</p>}

          {!loading && products.length === 0 && (
            <p>No products found</p>
          )}

          {!loading && products.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ================= ADD PRODUCT PLACEHOLDER ================= */}
      {showForm && (
        <div className="card">
          <h3>Add Product</h3>
          <p>
            (Form yahin aayega — abhi list fix karna priority tha)
          </p>

          <button className="btn gray" onClick={() => setShowForm(false)}>
            ← Back to Product List
          </button>
        </div>
      )}

    </div>
  );
}
