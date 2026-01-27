import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./adminProducts.css";

export default function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showBulk, setShowBulk] = useState(false);

  const [editProduct, setEditProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    part_no: "",
  });

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ================= EDIT OPEN =================
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name || "",
      price: p.price || "",
      stock: p.stock || "",
      part_no: p.part_no || "",
    });
  };

  // ================= UPDATE =================
  const updateProduct = async () => {
    await supabase
      .from("products")
      .update({
        name: form.name,
        price: form.price,
        stock: form.stock,
        part_no: form.part_no,
      })
      .eq("id", editProduct.id);

    alert("Product updated ✅");
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="page-header">
        <h2>Products</h2>

        <div className="top-actions">
          <button
            className="btn-outline"
            onClick={() => setShowBulk(!showBulk)}
          >
            Bulk Upload
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/admin/products/add")}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* BULK UPLOAD */}
      {showBulk && (
        <div className="table-card" style={{ marginBottom: 20 }}>
          <h3>Bulk Upload</h3>

          <select style={{ width: "100%", padding: 10, marginBottom: 10 }}>
            <option>Select Category</option>
            <option>Keyboard</option>
            <option>DC Jack</option>
            <option>Battery</option>
          </select>

          <input type="file" accept=".xlsx,.xls" />

          <br />
          <br />

          <button
            className="btn-primary"
            onClick={() =>
              alert("Excel upload backend baad me connect karenge ✅")
            }
          >
            Upload Excel
          </button>
        </div>
      )}

      {/* PRODUCT TABLE */}
      <div className="table-card">
        {loading ? (
          <div className="loading">Loading...</div>
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
                      <img src={p.image} className="thumb" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>

                  <td>{p.name}</td>
                  <td>{p.part_no}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>

                  <td>
                    <div className="actions">
                      <button
                        className="edit"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() => deleteProduct(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= EDIT POPUP ================= */}
      {editProduct && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>Edit Product</h3>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />

            <input
              placeholder="Part No"
              value={form.part_no}
              onChange={(e) =>
                setForm({ ...form, part_no: e.target.value })
              }
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" onClick={updateProduct}>
                Update
              </button>

              <button
                className="btn-outline"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
              }
