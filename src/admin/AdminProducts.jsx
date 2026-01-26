import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    part_number: ""
  });

  // ================= FETCH =================
  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= SAVE =================
  const saveProduct = async () => {
    if (!form.name) return alert("Product name required");

    if (editData) {
      await supabase
        .from("products")
        .update(form)
        .eq("id", editData.id);

      alert("Product updated");
    } else {
      await supabase.from("products").insert([form]);
      alert("Product added");
    }

    setForm({ name: "", price: "", stock: "", part_number: "" });
    setEditData(null);
    setShowAdd(false);
    fetchProducts();
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-wrapper">

      {/* HEADER */}
      <div className="admin-header">
        <h2>Products</h2>

        <div className="header-actions">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-outline" onClick={() => setShowBulk(true)}>
            Bulk Upload
          </button>

          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditData(p);
                      setForm(p);
                      setShowAdd(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={{ color: "red", marginLeft: 8 }}
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" align="center">
                  No products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAdd && (
        <div className="modal">
          <div className="modal-box">
            <h3>{editData ? "Edit Product" : "Add Product"}</h3>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
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

            <div className="modal-actions">
              <button onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveProduct}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK UPLOAD */}
      {showBulk && (
        <div className="modal">
          <div className="modal-box">
            <h3>Bulk Upload</h3>
            <p>Excel upload next step 🔜</p>

            <button onClick={() => setShowBulk(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
                }
