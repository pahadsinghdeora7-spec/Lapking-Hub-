import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import * as XLSX from "xlsx";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [search, setSearch] = useState("");

  const emptyForm = {
    name: "",
    category_slug: "",
    brand: "",
    part_number: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    image1: "",
    image2: "",
    status: true
  };

  const [form, setForm] = useState(emptyForm);

  // ================= FETCH =================
  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= OPEN EDIT =================
  const openProduct = (item) => {
    setSelected(item);
    setForm({
      name: item.name || "",
      category_slug: item.category_slug || "",
      brand: item.brand || "",
      part_number: item.part_number || "",
      price: item.price || "",
      stock: item.stock || "",
      description: item.description || "",
      image: item.image || "",
      image1: item.image1 || "",
      image2: item.image2 || "",
      status: item.status ?? true
    });
  };

  // ================= UPDATE =================
  const updateProduct = async () => {
    await supabase.from("products").update(form).eq("id", selected.id);
    setSelected(null);
    fetchProducts();
  };

  // ================= DELETE =================
  const deleteProduct = async () => {
    if (!window.confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", selected.id);
    setSelected(null);
    fetchProducts();
  };

  // ================= ADD PRODUCT =================
  const addProduct = async () => {
    await supabase.from("products").insert(form);
    setShowAdd(false);
    setForm(emptyForm);
    fetchProducts();
  };

  // ================= BULK UPLOAD =================
  const handleBulkUpload = async () => {
    if (!excelFile) {
      alert("Select Excel file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (let row of rows) {
        await supabase.from("products").insert({
          name: row.name || "",
          category_slug: row.category_slug || "",
          brand: row.brand || "",
          part_number: row.part_number || "",
          price: Number(row.price || 0),
          stock: Number(row.stock || 0),
          description: row.description || "",
          image: row.image || "",
          image1: row.image1 || "",
          image2: row.image2 || "",
          status: true
        });
      }

      alert("Bulk upload successful ✅");
      setExcelFile(null);
      setShowBulk(false);
      fetchProducts();
    };

    reader.readAsArrayBuffer(excelFile);
  };

  // ================= FILTER =================
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products">

      {/* ================= HEADER ================= */}
      <div className="top-bar">
        <h2>Products</h2>

        <div className="top-actions">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => setShowBulk(true)}>Bulk Upload</button>
          <button onClick={() => setShowAdd(true)}>+ Add Product</button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr><td colSpan="8">Loading...</td></tr>
            )}

            {!loading && filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img src={p.image} className="thumb" />
                  ) : (
                    <div className="no-img">No Image</div>
                  )}
                </td>

                <td>{p.name}</td>
                <td>{p.category_slug || "-"}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price || 0}</td>
                <td>{p.stock || 0}</td>

                <td>
                  <button className="edit-btn" onClick={() => openProduct(p)}>
                    Click
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT POPUP ================= */}
      {selected && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Edit Product</h3>

            {Object.keys(form).map((key) =>
              key !== "status" ? (
                key === "description" ? (
                  <textarea
                    key={key}
                    placeholder={key}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    key={key}
                    placeholder={key}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                )
              ) : null
            )}

            <div className="modal-actions">
              <button className="save" onClick={updateProduct}>Update</button>
              <button className="delete" onClick={deleteProduct}>Delete</button>
              <button className="close" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PRODUCT ================= */}
      {showAdd && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Add Product</h3>

            {Object.keys(emptyForm).map((key) =>
              key !== "status" ? (
                key === "description" ? (
                  <textarea
                    key={key}
                    placeholder={key}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    key={key}
                    placeholder={key}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                )
              ) : null
            )}

            <div className="modal-actions">
              <button className="save" onClick={addProduct}>Save</button>
              <button className="close" onClick={() => setShowAdd(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BULK UPLOAD ================= */}
      {showBulk && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Bulk Upload (Excel)</h3>

            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />

            <div className="modal-actions">
              <button className="save" onClick={handleBulkUpload}>
                Upload
              </button>
              <button className="close" onClick={() => setShowBulk(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
