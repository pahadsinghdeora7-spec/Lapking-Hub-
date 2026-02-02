import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category_slug: "",
    brand: "",
    part_number: "",
    compatible_model: "",
    description: "",
    price: "",
    stock: "",
    status: true,
    image: "",
    image1: "",
    image2: ""
  });

  // ================= FETCH =================
  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const value = search.toLowerCase();
    setFiltered(
      products.filter(p =>
        p.name?.toLowerCase().includes(value) ||
        p.part_number?.toLowerCase().includes(value) ||
        p.brand?.toLowerCase().includes(value)
      )
    );
  }, [search, products]);

  // ================= OPEN =================
  const openProduct = (item) => {
    setSelected(item);
    setForm({
      name: item.name || "",
      category_slug: item.category_slug || "",
      brand: item.brand || "",
      part_number: item.part_number || "",
      compatible_model: item.compatible_model || "",
      description: item.description || "",
      price: item.price || "",
      stock: item.stock || "",
      status: item.status ?? true,
      image: item.image || "",
      image1: item.image1 || "",
      image2: item.image2 || ""
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
    await supabase.from("products").delete().eq("id", selected.id);
    setSelected(null);
    fetchProducts();
  };

  return (
    <div className="admin-products">

      <div className="page-header">
        <h2>Products</h2>
        <input
          className="search-box"
          placeholder="Search product, part no, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && <tr><td colSpan="9">Loading...</td></tr>}

            {!loading && filtered.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image
                    ? <img src={p.image} className="thumb" />
                    : <div className="no-img">No image</div>}
                </td>
                <td>{p.name}</td>
                <td>{p.category_slug || "-"}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price || 0}</td>
                <td>{p.stock || 0}</td>
                <td>{p.status ? "Active" : "Inactive"}</td>
                <td>
                  <button className="edit-btn" onClick={() => openProduct(p)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT POPUP ================= */}
      {selected && (
        <div className="modal-bg">
          <div className="modal">

            <h3>Edit Product</h3>

            <label>Product Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

            <label>Category Slug</label>
            <input value={form.category_slug} onChange={e => setForm({ ...form, category_slug: e.target.value })} />

            <label>Brand</label>
            <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />

            <label>Part Number</label>
            <input value={form.part_number} onChange={e => setForm({ ...form, part_number: e.target.value })} />

            <label>Compatible Models</label>
            <textarea
              rows="2"
              placeholder="X407, X407U, A407"
              value={form.compatible_model}
              onChange={e => setForm({ ...form, compatible_model: e.target.value })}
            />

            <label>Description</label>
            <textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

            <label>Price</label>
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

            <label>Stock</label>
            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />

            <label>Status</label>
            <select
              value={form.status ? "true" : "false"}
              onChange={e => setForm({ ...form, status: e.target.value === "true" })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <label>Main Image URL</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            {form.image && <img src={form.image} className="preview" />}

            <label>Image 1</label>
            <input value={form.image1} onChange={e => setForm({ ...form, image1: e.target.value })} />
            {form.image1 && <img src={form.image1} className="preview" />}

            <label>Image 2</label>
            <input value={form.image2} onChange={e => setForm({ ...form, image2: e.target.value })} />
            {form.image2 && <img src={form.image2} className="preview" />}

            <div className="modal-actions">
              <button className="save" onClick={updateProduct}>Update</button>
              <button className="delete" onClick={deleteProduct}>Delete</button>
              <button className="close" onClick={() => setSelected(null)}>Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
