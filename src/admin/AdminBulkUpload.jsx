import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./AdminBulkUpload.css";

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // load categories
  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");

    setCategories(data || []);
  }

  // CSV reader (NO library)
  const readCSV = (text) => {
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0].split(",").map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(",");
      let obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i]?.trim() || "";
      });
      return obj;
    });
  };

  async function handleUpload() {
    if (!file || !category) {
      alert("Select category and CSV file");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const rows = readCSV(text);

        const products = rows.map((row) => ({
          name: row.name,
          price: Number(row.price || 0),
          stock: Number(row.stock || 0),
          category_id: category,
          image: row.image || "",
          description: row.description || ""
        }));

        const { error } = await supabase
          .from("products")
          .insert(products);

        if (error) {
          alert("Upload failed");
        } else {
          alert("✅ Products uploaded successfully");
          setFile(null);
        }
      } catch (err) {
        alert("Invalid CSV file");
      }

      setLoading(false);
    };

    reader.readAsText(file);
  }

  return (
    <div className="bulk-wrapper">
      <h2>📦 Bulk Upload Products</h2>

      <div className="bulk-card">
        <label>Select Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Upload CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>

        <div className="note">
          <b>CSV Format:</b><br />
          name, price, stock, category, image, description
        </div>
      </div>
    </div>
  );
}
