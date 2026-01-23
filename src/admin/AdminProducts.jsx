import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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

  // ---------------- FETCH ----------------
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

  // ---------------- DELETE ----------------
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">Products</h2>

      {/* ADD PRODUCT */}
      <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-3">

        <select
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Part number"
          value={form.part_number}
          onChange={(e) => setForm({ ...form, part_number: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Main image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Image 1 URL"
          value={form.image1}
          onChange={(e) => setForm({ ...form, image1: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Image 2 URL"
          value={form.image2}
          onChange={(e) => setForm({ ...form, image2: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Compatible models"
          value={form.compatible_m}
          onChange={(e) =>
            setForm({ ...form, compatible_m: e.target.value })
          }
        />

        <textarea
          className="border p-2 rounded col-span-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={addProduct}
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded col-span-full hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.id}</td>
                <td>{p.name}</td>
                <td>{p.categories?.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
