import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AddProductPage.css";

export default function AdminAddProduct() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
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

  // ================= LOAD CATEGORIES =================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id,name,slug")
      .order("name");

    setCategories(data || []);
  };

  // ================= IMAGE UPLOAD =================
  const uploadImage = async (file) => {
    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      alert("Image upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ================= SAVE PRODUCT =================
  const saveProduct = async () => {

    if (!form.name || !form.category_id || !form.price) {
      alert("Product name, category & price required");
      return;
    }

    setLoading(true);

    const mainImg = await uploadImage(images.image);
    const img1 = await uploadImage(images.image1);
    const img2 = await uploadImage(images.image2);

    const { error } = await supabase.from("products").insert([{
      name: form.name,
      category_id: Number(form.category_id),
      category_slug: form.category_slug,
      brand: form.brand,
      part_number: form.part_number,
      compatible_model: form.compatible_model,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      description: form.description,
      image: mainImg,
      image1: img1,
      image2: img2,
      status: true
    }]);

    setLoading(false);

    if (error) {
      console.log(error);
      alert("Error saving product");
      return;
    }

    alert("Product added successfully ✅");

    setForm({
      name: "",
      category_id: "",
      category_slug: "",
      brand: "",
      part_number: "",
      compatible_model: "",
      price: "",
      stock: "",
      description: ""
    });

    setImages({ image: null, image1: null, image2: null });
  };

  return (
    <div className="add-product-page">

      <h2>Add Product</h2>

      <div className="card">

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        {/* CATEGORY DROPDOWN */}
        <select
          value={form.category_id}
          onChange={(e)=>{
            const cat = categories.find(c => c.id === Number(e.target.value));
            setForm({
              ...form,
              category_id: cat.id,
              category_slug: cat.slug
            });
          }}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Brand"
          value={form.brand}
          onChange={(e)=>setForm({...form,brand:e.target.value})}
        />

        <input
          placeholder="Part Number"
          value={form.part_number}
          onChange={(e)=>setForm({...form,part_number:e.target.value})}
        />

        <input
          placeholder="Compatible Model"
          value={form.compatible_model}
          onChange={(e)=>setForm({...form,compatible_model:e.target.value})}
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})}
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e)=>setForm({...form,stock:e.target.value})}
        />

        <textarea
          rows="5"
          placeholder="Product Description"
          value={form.description}
          onChange={(e)=>setForm({...form,description:e.target.value})}
        />
      </div>

      <div className="card">
        <h4>Product Images</h4>

        <input type="file" onChange={(e)=>setImages({...images,image:e.target.files[0]})}/>
        <input type="file" onChange={(e)=>setImages({...images,image1:e.target.files[0]})}/>
        <input type="file" onChange={(e)=>setImages({...images,image2:e.target.files[0]})}/>
      </div>

      <button className="save-btn" onClick={saveProduct} disabled={loading}>
        {loading ? "Uploading..." : "Save Product"}
      </button>

    </div>
  );
          }
