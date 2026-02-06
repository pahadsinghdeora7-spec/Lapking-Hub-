import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
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

  // ================= FETCH PRODUCTS =================
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

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");

    setCategories(data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  // ================= OPEN PRODUCT =================
  const openProduct = (item) => {
    setSelected(item);
    setForm({
      name: item.name || "",
      category_id: item.category_id || "",
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

  // ================= MULTIPLE IMAGE UPLOAD =================
  const uploadMultipleImages = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const fields = ["image", "image1", "image2"];

    for (let i = 0; i < files.length && i < 3; i++) {
      const file = files[i];
      const fileName = `${Date.now()}-${i}-${file.name}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file, { upsert: true });

      if (error) continue;

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      setForm(prev => ({
        ...prev,
        [fields[i]]: data.publicUrl
      }));
    }

    setUploading(false);
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
              <th>Brand</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && <tr><td colSpan="8">Loading...</td></tr>}

            {!loading && filtered.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image
                    ? <img src={p.image} className="thumb" />
                    : <div className="no-img">No image</div>}
                </td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.part_number}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
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

      {/* ================= EDIT MODAL ================= */}
      {selected && (
        <div className="modal-bg">
          <div className="modal">

            <h3>Edit Product</h3>

            <label>Product Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

            <label>Category</label>
            <select
              value={form.category_id}
              onChange={(e) => {
                const cat = categories.find(c => c.id == e.target.value);
                setForm({
                  ...form,
                  category_id: cat.id,
                  category_slug: cat.slug
                });
              }}
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label>Brand</label>
            <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />

            <label>Part Number</label>
            <input value={form.part_number} onChange={e => setForm({ ...form, part_number: e.target.value })} />

            <label>Compatible Models</label>
            <textarea value={form.compatible_model} onChange={e => setForm({ ...form, compatible_model: e.target.value })} />

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

            {/* ✅ SINGLE INPUT – MULTIPLE IMAGES */}
            <label>Upload Images (max 3)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => uploadMultipleImages(e.target.files)}
            />

            {form.image && <img src={form.image} className="preview" />}
            {form.image1 && <img src={form.image1} className="preview" />}
            {form.image2 && <img src={form.image2} className="preview" />}

            {uploading && <p style={{ color: "blue" }}>Uploading image...</p>}

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
