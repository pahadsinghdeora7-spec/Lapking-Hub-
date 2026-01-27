import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    part_number: "",
    description: "",
  });

  const [image, setImage] = useState(null);

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

  // ================= IMAGE UPLOAD =================
  const uploadImage = async (file) => {
    if (!file) return "";

    const fileName = `${Date.now()}-${file.name}`;

    await supabase.storage.from("products").upload(fileName, file);

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ================= SAVE / UPDATE =================
  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert("Product name & price required");
      return;
    }

    setLoading(true);

    let imgUrl = "";
    if (image) imgUrl = await uploadImage(image);

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      part_number: form.part_number,
      description: form.description,
    };

    if (imgUrl) payload.image = imgUrl;

    if (editId) {
      await supabase.from("products").update(payload).eq("id", editId);
      alert("✅ Product updated");
    } else {
      await supabase.from("products").insert([payload]);
      alert("✅ Product added");
    }

    setLoading(false);
    setShowForm(false);
    setEditId(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      part_number: "",
      description: "",
    });
    setImage(null);

    fetchProducts();
  };

  // ================= EDIT =================
  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name || "",
      price: p.price || "",
      stock: p.stock || "",
      part_number: p.part_number || "",
      description: p.description || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      {/* TOP BUTTON */}
      <div style={{ marginBottom: 15 }}>
        <button
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 6,
            border: "none",
          }}
          onClick={() => {
            setShowForm(true);
            setEditId(null);
          }}
        >
          + Add Product
        </button>
      </div>

      {/* FORM CARD */}
      {showForm && (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,.08)",
            marginBottom: 30,
          }}
        >
          <h3>{editId ? "Edit Product" : "Add Product"}</h3>

          <input
            placeholder="Product name"
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
            placeholder="Part number"
            value={form.part_number}
            onChange={(e) =>
              setForm({ ...form, part_number: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <div style={{ marginTop: 10 }}>
            <button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : editId ? "Update Product" : "Save Product"}
            </button>

            <button
              style={{ marginLeft: 10 }}
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT TABLE */}
      <table width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Part No</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                {p.image ? (
                  <img
                    src={p.image}
                    style={{
                      width: 45,
                      height: 45,
                      objectFit: "contain",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.part_number}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>{" "}
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
