import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // ================= IMAGE UPLOAD (FINAL FIX) =================
  const uploadImage = async (file, field) => {
    if (!file) return;

    try {
      setUploading(true);

      // ✅ ensure auth session
      await supabase.auth.getSession();

      const ext = file.name.split(".").pop();
      const safeRandom = Math.floor(Math.random() * 1000000);
      const fileName = `${Date.now()}-${safeRandom}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error("UPLOAD ERROR:", error);
        alert("Image upload failed");
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setForm(prev => ({
        ...prev,
        [field]: data.publicUrl
      }));

    } catch (err) {
      console.error("UPLOAD EXCEPTION:", err);
      alert("Upload error");
    } finally {
      setUploading(false);
    }
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

      {/* ================= EDIT POPUP ================= */}
      {selected && (
        <div className="modal-bg">
          <div className="modal">

            <h3>Edit Product</h3>

            <label>Product Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

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

            <label>Main Image</label>
            <input type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0], "image")} />
            {form.image && <img src={form.image} className="preview" />}

            <label>Image 1</label>
            <input type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0], "image1")} />
            {form.image1 && <img src={form.image1} className="preview" />}

            <label>Image 2</label>
            <input type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0], "image2")} />
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
