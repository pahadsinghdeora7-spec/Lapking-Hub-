import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AddProductPage.css";

export default function AddProduct() {

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category_slug: "",
    brand: "",
    part_number: "",
    compatible_model: "",
    price: "",
    stock: "",
    description: ""
  });

  const [images, setImages] = useState({
    image: null,
    image1: null,
    image2: null
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

  // ================= IMAGE UPLOAD =================
  const uploadImage = async (file) => {
    if (!file) return "";

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) return "";

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ================= SAVE =================
  const saveProduct = async () => {

    if (!form.name || !form.price) {
      alert("Product name & price required");
      return;
    }

    const mainImage = await uploadImage(images.image);
    const image1 = await uploadImage(images.image1);
    const image2 = await uploadImage(images.image2);

    const { error } = await supabase.from("products").insert([{
      ...form,
      image: mainImage,
      image1,
      image2
    }]);

    if (error) {
      alert("Error saving product");
    } else {
      alert("Product added successfully");

      setForm({
        name: "",
        category_slug: "",
        brand: "",
        part_number: "",
        compatible_model: "",
        price: "",
        stock: "",
        description: ""
      });

      setImages({
        image: null,
        image1: null,
        image2: null
      });
    }
  };

  return (
    <div className="add-product-page">

      {/* HEADER */}
      <div className="page-header">
        <h2>Add Product</h2>

        <button className="bulk-btn">
          Bulk Upload Excel
        </button>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="card">
        <h4>Product Details</h4>

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.category_slug}
          onChange={e => setForm({ ...form, category_slug: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <div className="grid-2">
          <input
            placeholder="Brand"
            value={form.brand}
            onChange={e => setForm({ ...form, brand: e.target.value })}
          />

          <input
            placeholder="Part Number"
            value={form.part_number}
            onChange={e => setForm({ ...form, part_number: e.target.value })}
          />
        </div>

        <input
          placeholder="Compatible Model"
          value={form.compatible_model}
          onChange={e => setForm({ ...form, compatible_model: e.target.value })}
        />

        <div className="grid-2">
          <input
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <input
            placeholder="Stock"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <textarea
          className="desc-box"
          placeholder="Product Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* IMAGES */}
      <div className="card">
        <h4>Product Images</h4>

        <label>Main Image</label>
        <input type="file" onChange={e => setImages({ ...images, image: e.target.files[0] })} />

        <label>Image 1</label>
        <input type="file" onChange={e => setImages({ ...images, image1: e.target.files[0] })} />

        <label>Image 2</label>
        <input type="file" onChange={e => setImages({ ...images, image2: e.target.files[0] })} />
      </div>

      <button className="save-btn" onClick={saveProduct}>
        Save Product
      </button>

    </div>
  );
            }
