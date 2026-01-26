import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import * as XLSX from "xlsx";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const [excelFile, setExcelFile] = useState(null);
  const [bulkCategory, setBulkCategory] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    stock: "",
    part_number: "",
    compatible_model: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("id", { ascending: false });

    setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  // ================= ADD PRODUCT =================

  const addProduct = async () => {
    if (!form.name || !form.category_id || !form.price) {
      alert("Required fields missing");
      return;
    }

    await supabase.from("products").insert([
      {
        category_id: Number(form.category_id),
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        part_number: form.part_number,
        compatible_model: form.compatible_model,
        description: form.description,
      },
    ]);

    setShowAdd(false);
    setForm({
      category_id: "",
      name: "",
      price: "",
      stock: "",
      part_number: "",
      compatible_model: "",
      description: "",
    });

    fetchProducts();
  };

  // ================= BULK UPLOAD =================

  const uploadExcel = async () => {
    if (!excelFile || !bulkCategory) {
      alert("Select category and excel file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const formatted = rows.map((row) => ({
        category_id: Number(bulkCategory),
        name: row.name,
        price: Number(row.price || 0),
        stock: Number(row.stock || 0),
        part_number: row.part_number || "",
        compatible_model: row.compatible_model || "",
        description: row.description || "",
      }));

      await supabase.from("products").insert(formatted);

      alert("Bulk upload completed");
      setShowBulk(false);
      fetchProducts();
    };

    reader.readAsBinaryString(excelFile);
  };

  // ================= DELETE =================

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <h2>Products</h2>

        <div className="btn-group">
          <button className="btn-outline" onClick={() => setShowBulk(true)}>
            Bulk Upload
          </button>

          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Product
          </button>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="card">
        {products.map((p) => (
          <div className="product-row" key={p.id}>
            <div>
              <b>{p.name}</b>
              <div className="muted">
                ₹{p.price} | Stock: {p.stock}
              </div>
              <small>{p.categories?.name}</small>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteProduct(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {showAdd && (
        <div className="modal">
          <div className="modal-box">
            <h3>Add Product</h3>

            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />

            <input
              placeholder="Part Number"
              value={form.part_number}
              onChange={(e) =>
                setForm({ ...form, part_number: e.target.value })
              }
            />

            <input
              placeholder="Compatible Models"
              value={form.compatible_model}
              onChange={(e) =>
                setForm({ ...form, compatible_model: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={addProduct}>
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BULK UPLOAD MODAL ================= */}
      {showBulk && (
        <div className="modal">
          <div className="modal-box">
            <h3>Bulk Upload Products</h3>

            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />

            <div className="modal-actions">
              <button onClick={() => setShowBulk(false)}>Cancel</button>
              <button className="btn-primary" onClick={uploadExcel}>
                Upload Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
        }
