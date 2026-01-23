import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

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
    compatible_m: "",
    description: "",
    status: true,
  });

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  };

  // ---------------- FETCH PRODUCTS ----------------
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

  // ---------------- ADD PRODUCT ----------------
  const addProduct = async () => {
    if (!form.name || !form.category_id || !form.price) {
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
        compatible_m: form.compatible_m,
        description: form.description,
        status: form.status,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Product added successfully");
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
      fetchProducts();
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={{ padding: 20 }}>
      <h2>Products Management</h2>

      {/* ADD PRODUCT */}
      <div style={{ maxWidth: 500 }}>
        <select
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="Stock"
          type="number"
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

        <input
          placeholder="Main image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
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

      {/* PRODUCT LIST */}
      <h3>Total Products: {products.length}</h3>

      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 8,
          }}
        >
          <b>{p.name}</b>
          <div>₹{p.price}</div>
          <div>Stock: {p.stock}</div>
        </div>
      ))}
    </div>
  );
}
