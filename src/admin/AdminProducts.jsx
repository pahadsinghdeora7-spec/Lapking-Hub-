import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    stock: "",
    part_number: "",
    image: "",
    image1: "",
    image2: "",
    compatible_m: "",
    description: "",
    status: true,
  });

  // ================= FETCH =================
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ================= ADD / UPDATE =================
  const saveProduct = async () => {
    if (!form.category_id || !form.name || !form.price) {
      alert("Category, Name aur Price required hai");
      return;
    }

    setLoading(true);

    if (editId) {
      // UPDATE
      const { error } = await supabase
        .from("products")
        .update({
          category_id: Number(form.category_id),
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock || 0),
          part_number: form.part_number,
          image: form.image,
          image1: form.image1,
          image2: form.image2,
          compatible_m: form.compatible_m,
          description: form.description,
          status: form.status,
        })
        .eq("id", editId);

      if (error) alert(error.message);
      else alert("✅ Product updated");

    } else {
      // INSERT
      const { error } = await supabase.from("products").insert([
        {
          category_id: Number(form.category_id),
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock || 0),
          part_number: form.part_number,
          image: form.image,
          image1: form.image1,
          image2: form.image2,
          compatible_m: form.compatible_m,
          description: form.description,
          status: form.status,
        },
      ]);

      if (error) alert(error.message);
      else alert("✅ Product added");
    }

    setLoading(false);
    resetForm();
    fetchProducts();
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      category_id: "",
      name: "",
      price: "",
      stock: "",
      part_number: "",
      image: "",
      image1: "",
      image2: "",
      compatible_m: "",
      description: "",
      status: true,
    });
  };

  // ================= EDIT =================
  const editProduct = (p) => {
    setEditId(p.id);
    setForm({
      category_id: p.category_id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      part_number: p.part_number,
      image: p.image,
      image1: p.image1,
      image2: p.image2,
      compatible_m: p.compatible_m,
      description: p.description,
      status: p.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛒 Admin Products</h2>

      {/* FORM */}
      <div style={{ background: "#fff", padding: 15, borderRadius: 8 }}>
        <h3>{editId ? "Update Product" : "Add Product"}</h3>

        <select
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Price" type="number" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <input placeholder="Stock" type="number" value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })} />

        <input placeholder="Part number" value={form.part_number}
          onChange={(e) => setForm({ ...form, part_number: e.target.value })} />

        <input placeholder="Main image URL" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })} />

        <textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <button onClick={saveProduct} disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
        </button>

        {editId && (
          <button onClick={resetForm} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        )}
      </div>

      {/* LIST */}
      <table width="100%" border="1" cellPadding="8" style={{ marginTop: 25 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>₹</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
