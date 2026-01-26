import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const [csvFile, setCsvFile] = useState(null);
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
      alert("Category, name and price required");
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
    fetchProducts();
  };

  // ================= CSV BULK UPLOAD =================

  const uploadCSV = () => {
    if (!csvFile || !bulkCategory) {
      alert("Select category and CSV file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const lines = e.target.result.split("\n");
      const headers = lines[0].split(",");

      const rows = lines.slice(1).map((line) => {
        const values = line.split(",");
        let obj = {};
        headers.forEach((h, i) => {
          obj[h.trim()] = values[i]?.trim();
        });
        return obj;
      });

      const formatted = rows
        .filter((r) => r.name)
        .map((r) => ({
          category_id: Number(bulkCategory),
          name: r.name,
          price: Number(r.price || 0),
          stock: Number(r.stock || 0),
          part_number: r.part_number || "",
          compatible_model: r.compatible_model || "",
          description: r.description || "",
        }));

      await supabase.from("products").insert(formatted);

      alert("Bulk upload successful");
      setShowBulk(false);
      fetchProducts();
    };

    reader.readAsText(csvFile);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="admin-page">

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

            <button className="delete-btn" onClick={() => deleteProduct(p.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ADD PRODUCT */}
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
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <input
              placeholder="Price"
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
            <input
              placeholder="Stock"
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />
            <input
              placeholder="Part Number"
              onChange={(e) =>
                setForm({ ...form, part_number: e.target.value })
              }
            />
            <input
              placeholder="Compatible Models"
              onChange={(e) =>
                setForm({ ...form, compatible_model: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={addProduct}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK CSV */}
      {showBulk && (
        <div className="modal">
          <div className="modal-box">
            <h3>Bulk Upload (CSV)</h3>

            <select onChange={(e) => setBulkCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
            />

            <div className="modal-actions">
              <button onClick={() => setShowBulk(false)}>Cancel</button>
              <button className="btn-primary" onClick={uploadCSV}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
              }
