import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    stock: "",
    part_number: "",
    compatible_model: "",
    description: "",
  });

  // ================= LOAD =================

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

  // ================= IMAGE UPLOAD =================

  const uploadImage = async (file) => {
    if (!file) return "";

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      alert("Image upload failed");
      return "";
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ================= ADD PRODUCT =================

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category_id) {
      alert("Category, name & price required");
      return;
    }

    const main = await uploadImage(image);
    const img1 = await uploadImage(image1);
    const img2 = await uploadImage(image2);

    const { error } = await supabase.from("products").insert([
      {
        category_id: Number(form.category_id),
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        part_number: form.part_number,
        compatible_model: form.compatible_model,
        description: form.description,
        image: main,
        image1: img1,
        image2: img2,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Product added successfully");
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
      setImage(null);
      setImage1(null);
      setImage2(null);
      fetchProducts();
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ================= UI =================

  return (
    <div className="admin-page">

      <div className="top-bar">
        <h2>Products</h2>

        <div className="top-actions">
          <button className="btn" onClick={() => setShowBulk(true)}>
            📦 Bulk Upload
          </button>

          <button className="btn primary" onClick={() => setShowAdd(true)}>
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* ================= PRODUCT TABLE ================= */}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No products
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image && (
                    <img
                      src={p.image}
                      alt=""
                      style={{ width: 45, height: 45, objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.categories?.name}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
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

            <label>Main Image</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

            <label>Image 1</label>
            <input type="file" onChange={(e) => setImage1(e.target.files[0])} />

            <label>Image 2</label>
            <input type="file" onChange={(e) => setImage2(e.target.files[0])} />

            <div className="modal-actions">
              <button onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="primary" onClick={addProduct}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BULK UPLOAD ================= */}

      {showBulk && (
        <div className="modal">
          <div className="modal-box">
            <h3>Bulk Upload</h3>

            <select>
              <option>Select Category</option>
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>

            <input type="file" accept=".xlsx,.xls" />

            <div className="modal-actions">
              <button onClick={() => setShowBulk(false)}>Cancel</button>
              <button className="primary">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
