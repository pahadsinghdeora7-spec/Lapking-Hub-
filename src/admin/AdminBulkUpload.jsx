import { useState } from "react";
import { supabase } from "../supabaseClient";
import * as XLSX from "xlsx";
import "./AddProductPage.css";

export default function AdminBulkUpload() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select Excel file");

    setLoading(true);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      await supabase.from("products").insert({
        name: row.name,
        category_slug: row.category_slug,
        compatible_model: row.compatible_model,
        price: row.price,
        stock: row.stock,
        description: row.description,
        status: true
      });
    }

    setLoading(false);
    alert("Bulk upload completed ✅");
  };

  return (
    <div className="admin-products">

      <h2>Bulk Upload Products</h2>

      <div className="card">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="save-btn" onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Excel"}
        </button>

        <p style={{ marginTop: 10, fontSize: 13 }}>
          Excel columns must be:
          <br />
          <b>
            name, category_slug, compatible_model,
            price, stock, description
          </b>
        </p>
      </div>

    </div>
  );
      }
