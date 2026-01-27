import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // ================= FETCH =================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
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
    if (!form.name || !form.price) {
      alert("Product name & price required");
      return;
    }

    setLoading(true);

    const img = await uploadImage(image);
    const img1 = await uploadImage(image1);
    const img2 = await uploadImage(image2);

    const { error } = await supabase.from("products").insert([
      {
        category_id: form.category_id || null,
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        part_number: form.part_number,
        compatible_model: form.compatible_model,
        description: form.description,
        image: img,
        image1: img1,
        image2: img2,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Product added successfully");

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

      fetchProducts(); // 🔥 IMPORTANT
    }
  };

  // ================= DELETE =================

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ================= UI =================

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      {/* ================= PRODUCT TABLE ================= */}

      <div style={{ background: "#fff", borderRadius: 10, padding: 15 }}>
        <table width="100%" cellPadding="10">
          <thead>
            <tr style={{ background: "#f5f7fa" }}>
              <th>Image</th>
              <th>Product</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="6" align="center">
                  No products
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                {/* IMAGE */}
                <td>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: 4,
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 10 }}>No Image</span>
                    )}
                  </div>
                </td>

                <td>{p.name}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>

                <td>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD PRODUCT ================= */}

      <h3 style={{ marginTop: 30 }}>Add Product</h3>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          maxWidth: 600,
        }}
      >
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

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <input type="file" onChange={(e) => setImage1(e.target.files[0])} />
        <input type="file" onChange={(e) => setImage2(e.target.files[0])} />

        <button
          onClick={addProduct}
          disabled={loading}
          style={{
            marginTop: 10,
            width: "100%",
            padding: 10,
            background: "#1677ff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
}
