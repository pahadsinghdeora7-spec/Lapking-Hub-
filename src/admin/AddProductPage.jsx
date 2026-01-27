import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AddProductPage.css";

export default function AddProduct() {

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category_slug: "",
    price: "",
    stock: "",
    part_number: "",
    compatible_model: "",
    description: "",
    image: "",
    image1: "",
    image2: ""
  });

  // ================= LOAD CATEGORY =================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("name, slug")
      .order("name");

    setCategories(data || []);
  };

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SAVE =================
  const saveProduct = async () => {
    if (!form.name || !form.price) {
      alert("Product name & price required");
      return;
    }

    const { error } = await supabase.from("products").insert([form]);

    if (error) {
      alert("Error saving product");
    } else {
      alert("Product added successfully");

      setForm({
        name: "",
        category_slug: "",
        price: "",
        stock: "",
        part_number: "",
        compatible_model: "",
        description: "",
        image: "",
        image1: "",
        image2: ""
      });
    }
  };

  return (
    <div className="add-product-page">

      {/* HEADER */}
      <div className="page-header">
        <h2>Add Product</h2>

        <button
          className="bulk-btn"
          onClick={() => alert("Bulk upload coming next step")}
        >
          Bulk Upload Excel
        </button>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="card">
        <h4>Product Details</h4>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        {/* CATEGORY */}
        <select
          name="category_slug"
          value={form.category_slug}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="grid-2">
          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <input
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        <input
          name="part_number"
          placeholder="Part Number"
          value={form.part_number}
          onChange={handleChange}
        />

        <input
          name="compatible_model"
          placeholder="Compatible Model"
          value={form.compatible_model}
          onChange={handleChange}
        />

        <textarea
          rows="4"
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      {/* IMAGES */}
      <div className="card">
        <h4>Product Images</h4>

        <input
          name="image"
          placeholder="Main Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <input
          name="image1"
          placeholder="Image 1 URL"
          value={form.image1}
          onChange={handleChange}
        />

        <input
          name="image2"
          placeholder="Image 2 URL"
          value={form.image2}
          onChange={handleChange}
        />
      </div>

      <button className="save-btn" onClick={saveProduct}>
        Save Product
      </button>

    </div>
  );
      }
