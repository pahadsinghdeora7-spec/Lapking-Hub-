import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminBulkUpload.css";

export default function AdminBulkUpload() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    setCategories(data || []);
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!categoryId) {
      alert("Please select category");
      return;
    }

    if (!file) {
      alert("Please select CSV file");
      return;
    }

    setLoading(true);

    // CSV upload logic yaha rahega
    setTimeout(() => {
      alert("CSV uploaded successfully (demo)");
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="card bulk-upload-box">
      <h2 className="page-title">📄 Bulk Upload Products</h2>

      <p className="info-text">
        Upload CSV file only (Excel → Save As → CSV UTF-8)
      </p>

      {/* CATEGORY */}
      <div className="form-row">
        <label>Select Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* FILE */}
      <div className="form-row">
        <label>Upload CSV File</label>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      {/* ACTION */}
      <div className="upload-actions">
        <button
          className="btn-upload"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>
    </div>
  );
}
