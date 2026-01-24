import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    stock: "",
    part_number: "",
    image: "",
    image1: "",
    image2: "",
    compatible_model: "",
    description: "",
    status: true,
  });

  // ================= FETCH =================

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
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  };

  // ================= ADD PRODUCT =================

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category_id) {
      alert("Category, Name aur Price required hai");
      return;
    }

    setLoading(true);

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
        compatible_model: form.compatible_model,
        description: form.description,
        status: form.status,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setForm({
        category_id: "",
        name: "",
        price: "",
        stock: "",
        part_number: "",
        image: "",
        image1: "",
        image2: "",
        compatible_model: "",
        description: "",
        status: true,
      });

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
    <div>
      <h2>Admin Products</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
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
          placeholder="Main Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <input
          placeholder="Image 1 URL"
          value={form.image1}
          onChange={(e) => setForm({ ...form, image1: e.target.value })}
        />

        <input
          placeholder="Image 2 URL"
          value={form.image2}
          onChange={(e) => setForm({ ...form, image2: e.target.value })}
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

        <button onClick={addProduct} disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>

      <hr />

      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <b>{p.name}</b> — ₹{p.price}  
          <br />
          Model: {p.compatible_model}
          <br />
          Category: {p.categories?.name}
          <br />
          <button onClick={() => deleteProduct(p.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
