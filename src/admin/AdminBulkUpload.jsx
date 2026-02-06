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

  // ================= SMART CSV READER =================
  const readCSV = (text) => {
    const lines = text.split("\n").filter(l => l.trim());
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
        const rows = readCSV(e.target.result);

        const products = rows.map((row) => {
          // 🔹 PRICE CLEAN (250 PCS → 250)
          const cleanPrice = parseInt(
            String(row.price || row.price_unit || "0").replace(/\D/g, "")
          );

          return {
            name: row.product_name || row.name || "",
            brand: row.brand || "",
            part_number: row.part_number || "",
            price: cleanPrice || 0,
            stock: Number(row.stock || 0),
            category_id: category,
            image: row.image_url || row.image || "",
            description: row.description || "",
            compatible_model: row.compatible_model || "",
            status: true
          };
        });

        const { error } = await supabase
          .from("products")
          .insert(products);

        if (error) {
          console.error(error);
          alert("❌ Upload failed");
        } else {
          alert("✅ Products uploaded successfully (100%)");
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
          <b>Supported CSV Columns:</b><br />
          product_name / name,<br />
          brand,<br />
          part_number,<br />
          price / price_unit,<br />
          stock,<br />
          image_url / image,<br />
          description,<br />
          compatible_model
        </div>
      </div>
    </div>
  );
      }
