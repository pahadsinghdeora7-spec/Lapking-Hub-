import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminBulkUpload.css";

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD CATEGORIES =================
  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name")
      .order("name")
      .then(({ data }) => setCategories(data || []));
  }, []);

  // ================= SAFE CSV PARSER =================
  const parseCSV = (text) => {
    const rows = [];
    let current = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        current.push(value.trim());
        value = "";
      } else if ((char === "\n" || char === "\r") && !insideQuotes) {
        if (value || current.length) {
          current.push(value.trim());
          rows.push(current);
          current = [];
          value = "";
        }
      } else {
        value += char;
      }
    }

    if (value || current.length) {
      current.push(value.trim());
      rows.push(current);
    }

    const headers = rows[0].map(h => h.toLowerCase());

    return rows.slice(1).map(r => {
      let obj = {};
      headers.forEach((h, i) => {
        obj[h] = r[i] || "";
      });
      return obj;
    });
  };

  // ================= DELAY FUNCTION =================
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

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
        const rows = parseCSV(text);

        let success = 0;

        for (let row of rows) {
          const price =
            parseInt(String(row.price || "").replace(/\D/g, "")) || 0;

          const stock =
            parseInt(String(row.stock || "").replace(/\D/g, "")) || 0;

          const product = {
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

          if (!product.name) continue;

          const { error } = await supabase
            .from("products")
            .insert(product);

          if (!error) success++;

          // 🔥 IMPORTANT: delay (mobile + supabase safe)
          await sleep(120);
        }

        alert(`✅ ${success} products uploaded perfectly`);
        setFile(null);
      } catch (err) {
        console.error(err);
        alert("❌ CSV parsing failed");
      }

      setLoading(false);
    };

    reader.readAsText(file);
  }

  // ================= UI =================
  return (
    <div className="bulk-wrapper">
      <h2>📦 Bulk Upload Products (Safe Mode)</h2>

      <div className="bulk-card">
        <label>Select Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- Select Category --</option>
          {categories.map(c => (
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
          {loading ? "Uploading safely..." : "Upload CSV"}
        </button>

        <div className="note">
          <b>CSV Headers (exact):</b><br />
          product_name, brand, part_number, price, stock,<br />
          image_url, description, compatible_model
        </div>
      </div>
    </div>
  );
    }
