import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./addProduct.css";

export default function AddProduct() {

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    part_number: "",
    compatible_model: "",
    description: "",
    image: "",
    image1: "",
    image2: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

        <div className="top-actions">
          <button className="bulk-btn">
            Bulk Upload Excel
          </button>
        </div>
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

        <div className="grid-2">
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
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          rows="4"
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
