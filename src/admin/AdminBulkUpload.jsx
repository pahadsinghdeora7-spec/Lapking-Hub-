import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select CSV file");

    setLoading(true);

    const text = await file.text();
    const rows = text.split("\n").map(r => r.split(","));

    // remove header
    rows.shift();

    for (let row of rows) {
      const [
        name,
        category_slug,
        brand,
        part_number,
        compatible_model,
        price,
        stock,
        description
      ] = row;

      if (!name) continue;

      await supabase.from("products").insert({
        name: name?.trim(),
        category_slug: category_slug?.trim(),
        brand: brand?.trim(),
        part_number: part_number?.trim(),
        compatible_model: compatible_model?.trim(),
        price: Number(price || 0),
        stock: Number(stock || 0),
        description: description?.trim(),
        status: true
      });
    }

    setLoading(false);
    alert("Bulk upload completed");
  };

  return (
    <div className="admin-page">

      <h2>Bulk Upload Products</h2>

      <div className="card">
        <p style={{ fontSize: 13, color: "#666" }}>
          Upload CSV file only (Excel → Save As → CSV UTF-8)
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

    </div>
  );
}
