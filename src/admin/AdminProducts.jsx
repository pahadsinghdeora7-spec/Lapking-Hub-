import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
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

  // 🔹 Fetch products
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Add product
  const addProduct = async () => {
    if (!form.name || !form.price) {
      alert("Name & price required");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
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

    if (!error) {
      alert("Product added");
      setForm({
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
    } else {
      alert(error.message);
    }
  };

  // 🔹 Delete
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Products</h2>

      {/* ADD PRODUCT */}
      <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
        <h3>Add Product</h3>

        <input placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input placeholder="Part Number"
          value={form.part_number}
          onChange={(e) => setForm({ ...form, part_number: e.target.value })}
        />

        <input placeholder="Main Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <input placeholder="Image 1"
          value={form.image1}
          onChange={(e) => setForm({ ...form, image1: e.target.value })}
        />

        <input placeholder="Image 2"
          value={form.image2}
          onChange={(e) => setForm({ ...form, image2: e.target.value })}
        />

        <input placeholder="Compatible Models"
          value={form.compatible_m}
          onChange={(e) => setForm({ ...form, compatible_m: e.target.value })}
        />

        <textarea placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <br />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* LIST */}
      <h3 style={{ marginTop: 30 }}>All Products</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
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
                  <button onClick={() => deleteProduct(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
    }
