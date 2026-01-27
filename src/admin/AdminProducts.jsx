import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category_slug: "",
    brand: "",
    part_number: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    image1: "",
    image2: "",
    status: true
  });

  // ================= FETCH =================
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

  // ================= OPEN POPUP =================
  const openProduct = (item) => {
    setSelected(item);
    setForm({
      name: item.name || "",
      category_slug: item.category_slug || "",
      brand: item.brand || "",
      part_number: item.part_number || "",
      price: item.price || "",
      stock: item.stock || "",
      description: item.description || "",
      image: item.image || "",
      image1: item.image1 || "",
      image2: item.image2 || "",
      status: item.status ?? true
    });
  };

  // ================= UPDATE =================
  const updateProduct = async () => {
    await supabase
      .from("products")
      .update(form)
      .eq("id", selected.id);

    setSelected(null);
    fetchProducts();
  };

  // ================= DELETE =================
  const deleteProduct = async () => {
    if (!window.confirm("Delete this product?")) return;

    await supabase
      .from("products")
      .delete()
      .eq("id", selected.id);

    setSelected(null);
    fetchProducts();
  };

  return (
    <div className="admin-products">

      <h2>Products</h2>

      {/* ================= TABLE ================= */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr><td colSpan="8">Loading...</td></tr>
            )}

            {!loading && products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img src={p.image} className="thumb" />
                  ) : (
                    <div className="no-img">No Image</div>
                  )}
                </td>

                <td>{p.name}</td>
                <td>{p.category_slug || "-"}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price || 0}</td>
                <td>{p.stock || 0}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => openProduct(p)}
                  >
                    Click
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= POPUP ================= */}
      {selected && (
        <div className="modal-bg">
          <div className="modal">

            <h3>Edit Product</h3>

            <label>Product Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label>Category</label>
            <input
              value={form.category_slug}
              onChange={(e) =>
                setForm({ ...form, category_slug: e.target.value })
              }
            />

            <label>Brand</label>
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />

            <label>Part Number</label>
            <input
              value={form.part_number}
              onChange={(e) =>
                setForm({ ...form, part_number: e.target.value })
              }
            />

            <label>Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <label>Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />

            <label>Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <label>Main Image URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            <label>Image 1</label>
            <input
              value={form.image1}
              onChange={(e) => setForm({ ...form, image1: e.target.value })}
            />

            <label>Image 2</label>
            <input
              value={form.image2}
              onChange={(e) => setForm({ ...form, image2: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={updateProduct} className="save">
                Update
              </button>

              <button onClick={deleteProduct} className="delete">
                Delete
              </button>

              <button onClick={() => setSelected(null)} className="close">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
