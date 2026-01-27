import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH PRODUCTS
  // ======================
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

  // ======================
  // DELETE PRODUCT
  // ======================
  const deleteProduct = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="admin-page">

      <div className="page-header">
        <h2>Products</h2>

        <div className="top-actions">
          <button className="btn-outline">Bulk Upload</button>
          <button className="btn-primary">+ Add Product</button>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <p className="loading">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="loading">No products found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Part No</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        className="thumb"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>

                  <td>{p.name}</td>
                  <td>{p.part_number || "-"}</td>
                  <td>₹{p.price || 0}</td>
                  <td>{p.stock || 0}</td>

                  <td className="actions">
                    <button className="edit">Edit</button>
                    <button
                      className="delete"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
