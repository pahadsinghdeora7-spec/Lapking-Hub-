import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { supabase } from "../supabaseClient";
import "./AdminBulkUpload.css";

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");

    setCategories(data || []);
  }

  function handleFile(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) return alert("CSV file select karo");
    if (!categoryId) return alert("Category select karo");

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const rows = results.data;

        const products = rows.map((row) => ({
          name: row.name || "",
          price: Number(row.price) || 0,
          stock: Number(row.stock) || 0,
          brand: row.brand || "",
          part_no: row.part_no || "",
          description: row.description || "",
          image: row.image || "", // 🔥 IMAGE URL
          category_id: categoryId
        }));

        const { error } = await supabase
          .from("products")
          .insert(products);

        setLoading(false);

        if (error) {
          alert("Upload failed ❌");
          console.log(error);
        } else {
          alert("Bulk upload successful ✅");
          setFile(null);
        }
      }
    });
  }

  return (
    <div className="card">
      <h2>📦 Bulk Upload Products</h2>

      <p className="note">
        Excel → Save As → <b>CSV UTF-8</b>
      </p>

      {/* CATEGORY */}
      <label>Select Category</label>
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">-- Select Category --</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* FILE */}
      <label>Upload CSV File</label>
      <input type="file" accept=".csv" onChange={handleFile} />

      <button className="upload-btn" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      <div className="csv-format">
        <h4>CSV Columns Format</h4>

        <pre>
name,price,stock,brand,part_no,description,image
Keyboard,599,50,Dell,KB01,USB Keyboard,https://image-url.jpg
Mouse,299,100,HP,MS02,Optical Mouse,https://image-url.jpg
        </pre>

        <p>
          ⚠ Image column must contain <b>public image URL</b>
        </p>
      </div>
    </div>
  );
}
