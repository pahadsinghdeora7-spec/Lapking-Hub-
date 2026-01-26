import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-wrapper">

      {/* HEADER */}
      <div className="admin-header">
        <h2>Products</h2>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-outline">Bulk Upload</button>
          <button className="btn-primary">+ Add Product</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            )}

            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img src={p.image} className="thumb" />
                  ) : (
                    <div className="no-img">IMG</div>
                  )}
                </td>

                <td>{p.name}</td>
                <td>{p.category || "-"}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price || 0}</td>
                <td>
                  <span className="stock-badge">{p.stock || 0}</span>
                </td>
                <td>
                  <span className="status active">Active</span>
                </td>
                <td>
                  <button className="dots">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
