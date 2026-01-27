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

  const emptyForm = {
    name: "",
    category_slug: "",
    brand: "",
    part_number: "",
    compatible_model: "",
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
  const openEdit = (item) => {
    setSelected(item);
    setForm({
      name: item.name || "",
      category_slug: item.category_slug || "",
      brand: item.brand || "",
      part_number: item.part_number || "",
      compatible_model: item.compatible_model || "",
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
    if (!window.confirm("Delete this product?")) return;

    await supabase.from("products").delete().eq("id", selected.id);
    setSelected(null);
    fetchProducts();
  };

  // ================= ADD =================
  const addProduct = async () => {
    await supabase.from("products").insert(form);
    setShowAdd(false);
    setForm(emptyForm);
    fetchProducts();
  };

  // ================= BULK UPLOAD =================
  const uploadExcel = () => {
    if (!excelFile) return alert("Select Excel file");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (let r of rows) {
        await supabase.from("products").insert({
          name: r.name || "",
          category_slug: r.category_slug || "",
          brand: r.brand || "",
          part_number: r.part_number || "",
          compatible_model: r.compatible_model || "",
          price: Number(r.price || 0),
          stock: Number(r.stock || 0),
          description: r.description || "",
          image: r.image || "",
          image1: r.image1 || "",
          image2: r.image2 || "",
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

  return (
    <div className="admin-products">

      <div className="top-bar">
        <h2>Products</h2>
        <div>
          <button onClick={() => setShowBulk(true)}>Bulk Upload</button>
          <button onClick={() => setShowAdd(true)}>+ Add Product</button>
        </div>
      </div>

      {/* TABLE */}
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

            {!loading && products.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image ? <img src={p.image} className="thumb" /> : <div className="no-img">No Image</div>}
                </td>
                <td>{p.name}</td>
                <td>{p.category_slug || "-"}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price || 0}</td>
                <td>{p.stock || 0}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(p)}>Click</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT / BULK POPUPS SAME AS BEFORE */}

    </div>
  );
}
