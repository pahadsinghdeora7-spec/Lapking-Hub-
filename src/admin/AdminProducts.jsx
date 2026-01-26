import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    stock: "",
    part_number: "",
    compatible_model: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("id", { ascending: false });
    setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const name = `${Date.now()}-${file.name}`;
    await supabase.storage.from("products").upload(name, file);
    const { data } = supabase.storage.from("products").getPublicUrl(name);
    return data.publicUrl;
  };

  const addProduct = async () => {
    if (!form.category_id || !form.name || !form.price) {
      alert("Category, Name, Price required");
      return;
    }

    setLoading(true);

    const img = await uploadImage(imageFile);
    const img1 = await uploadImage(imageFile1);
    const img2 = await uploadImage(imageFile2);

    await supabase.from("products").insert([{
      ...form,
      category_id: Number(form.category_id),
      price: Number(form.price),
      stock: Number(form.stock || 0),
      image: img,
      image1: img1,
      image2: img2,
      status: true
    }]);

    setLoading(false);
    fetchProducts();
    alert("Product Added");

    setForm({
      category_id: "",
      name: "",
      price: "",
      stock: "",
      part_number: "",
      compatible_model: "",
      description: "",
    });
  };

  const filtered = selectedCategory
    ? products.filter(p => p.category_id == selectedCategory)
    : products;

  return (
    <div className="admin-page">

      {/* ADD PRODUCT */}
      <div className="admin-card">
        <h3>Add Product</h3>

        <div className="form-grid">
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          <input placeholder="Part Number" value={form.part_number} onChange={e => setForm({ ...form, part_number: e.target.value })} />

          <input type="file" onChange={e => setImageFile(e.target.files[0])} />
          <input type="file" onChange={e => setImageFile1(e.target.files[0])} />
          <input type="file" onChange={e => setImageFile2(e.target.files[0])} />

          <input placeholder="Compatible Models" value={form.compatible_model} onChange={e => setForm({ ...form, compatible_model: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        </div>

        <button className="btn-primary" onClick={addProduct}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="admin-card">
        <div className="card-head">
          <h3>Products</h3>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="product-grid">
          {filtered.length === 0 && <p className="muted">No products available</p>}

          {filtered.map(p => (
            <div className="product-box" key={p.id}>
              <b>{p.name}</b>
              <span>₹{p.price}</span>
              <small>{p.categories?.name}</small>
              <small>Stock: {p.stock}</small>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
