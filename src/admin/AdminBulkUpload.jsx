import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./AdminBulkUpload.css";

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD CATEGORIES =================
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

  // ================= CSV PARSER (SAFE) =================
  const readCSV = (text) => {
    const lines = text
      .replace(/\r/g, "")
      .split("\n")
      .filter(l => l.trim() !== "");

    const headers = lines[0]
      .split(",")
      .map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
      const values = line.split(",");
      let obj = {};

      headers.forEach((h, i) => {
        obj[h] = values[i]?.trim() || "";
      });

      return obj;
    });
  };

  // ================= UPLOAD =================
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

        const products = rows.map((row) => {
          // 🔥 CLEAN PRICE & STOCK
          const price = parseInt(
            String(row.price || "0").replace(/\D/g, "")
          ) || 0;

          const stock = parseInt(
            String(row.stock || "0").replace(/\D/g, "")
          ) || 0;

          return {
            name: row.product_name || row.name || "",
            brand: row.brand || "",
            part_number: row.part_number || "",
            compatible_model: row.compatible_model || "",
            description: row.description || "",
            image: row.image_url || row.image || "",
            price,
            stock,
            category_id: category,
            status: true
          };
        });

        const { error } = await supabase
          .from("products")
          .insert(products);

        if (error) {
          console.error(error);
          alert("❌ Upload failed. Check CSV format.");
        } else {
          alert(`✅ ${products.length} products uploaded successfully`);
          setFile(null);
        }

      } catch (err) {
        console.error(err);
        alert("❌ Invalid CSV file");
      }

      setLoading(false);
    };

    reader.readAsText(file);
  }

  // ================= UI =================
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
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
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
          <b>CSV FORMAT (exact):</b><br />
          product_name, brand, part_number, price, stock,<br />
          image_url, description, compatible_model
        </div>
      </div>
    </div>
  );
}
