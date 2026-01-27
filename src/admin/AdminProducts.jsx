import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    part_number: "",
    description: "",
  });

  const [image, setImage] = useState(null);

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

  const uploadImage = async (file) => {
    if (!file) return "";

    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from("products").upload(fileName, file);

    return supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) {
      alert("Product name & price required");
      return;
    }

    let img = "";
    if (image) img = await uploadImage(image);

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      part_number: form.part_number,
      description: form.description,
    };

    if (img) payload.image = img;

    if (editId) {
      await supabase.from("products").update(payload).eq("id", editId);
      alert("Product updated");
    } else {
      await supabase.from("products").insert([payload]);
      alert("Product added");
    }

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

  const editProduct = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      part_number: p.part_number,
      description: p.description,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="admin-container">
      <h2>Products</h2>

      <button className="primary-btn" onClick={() => setShowForm(true)}>
        + Add Product
      </button>

      {showForm && (
        <div className="card">
          <h3>{editId ? "Edit Product" : "Add Product"}</h3>

          <div className="grid">
            <input placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />

            <input placeholder="Part Number"
              value={form.part_number}
              onChange={(e) =>
                setForm({ ...form, part_number: e.target.value })
              }
            />
          </div>

          <textarea
            className="full"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <div className="btn-row">
            <button className="primary-btn" onClick={saveProduct}>
              {editId ? "Update Product" : "Save Product"}
            </button>

            <button className="gray-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
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
                    <img src={p.image} className="thumb" />
                  ) : (
                    <span className="noimg">No image</span>
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.part_number}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="edit-btn" onClick={() => editProduct(p)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
