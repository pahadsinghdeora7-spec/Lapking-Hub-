import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminBulkUpload.css";

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD CATEGORIES =================
  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id,name,slug")
      .order("name");

    setCategories(data || []);
  }

  // ================= CSV PARSER =================
  const parseCSV = (text) => {
    const rows = [];
    let row = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(value.trim());
        value = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (value || row.length) {
          row.push(value.trim());
          rows.push(row);
          row = [];
          value = "";
        }
      } else {
        value += char;
      }
    }

    if (value || row.length) {
      row.push(value.trim());
      rows.push(row);
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

  // ================= READ CSV =================
  const readFile = () => {
    if (!file) {
      alert("CSV file select karo");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);
      setRows(data);

      const cleaned = data
        .filter(r => r.name && r.part_number)
        .map(r => ({
          name: r.name.trim(),
          brand: r.brand?.trim() || "",
          part_number: r.part_number.trim(),
          price: Number(r.price) || 0,
          stock: Number(r.stock) || 0,
          description: r.description?.trim() || "",
          compatible_model: r.compatible_model?.trim() || "",
          image: r.image || "",
          status: true
        }));

      setPreview(cleaned);
      alert(`✅ ${cleaned.length} products ready to upload`);
    };

    reader.readAsText(file);
  };

  // ================= SAVE DATA =================
  const saveData = async () => {
    if (!category || preview.length === 0) {
      alert("Category select karo aur CSV read karo");
      return;
    }

    setLoading(true);

    try {
      const selectedCategory = categories.find(
        c => String(c.id) === String(category)
      );

      for (let i = 0; i < preview.length; i += 50) {
        const chunk = preview.slice(i, i + 50).map(p => ({
          ...p,
          category_id: Number(category),
          category_slug: selectedCategory?.slug || ""
        }));

        await supabase.from("products").insert(chunk);
      }

      alert("✅ All products uploaded successfully");
      setFile(null);
      setRows([]);
      setPreview([]);
    } catch (err) {
      console.error(err);
      alert("❌ Upload error");
    }

    setLoading(false);
  };

  // ================= UI =================
  return (
    <div className="bulk-wrapper">
      <h2>📦 Bulk Upload Products</h2>

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

        <button onClick={readFile}>📖 Read CSV</button>

        {preview.length > 0 && (
          <p style={{ color: "green" }}>
            {preview.length} products validated ✔
          </p>
        )}

        <button onClick={saveData} disabled={loading}>
          {loading ? "Uploading..." : "💾 Save to Database"}
        </button>

        <div className="note">
          <b>CSV Header (EXACT):</b><br />
          name, brand, part_number, price, stock, description, compatible_model, image
        </div>
      </div>
    </div>
  );
}
