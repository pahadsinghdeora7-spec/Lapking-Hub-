import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import "./admin.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    stock: "",
    part_number: "",
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
      alert("Category, Name aur Price required hai");
      return;
    }

    setLoading(true);

    const mainImage = await uploadImage(imageFile);
    const img1 = await uploadImage(imageFile1);
    const img2 = await uploadImage(imageFile2);

    const { error } = await supabase.from("products").insert([
      {
        category_id: Number(form.category_id),
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        part_number: form.part_number,
        image: mainImage,
        image1: img1,
        image2: img2,
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
        compatible_model: "",
        description: "",
        status: true,
      });

      setImageFile(null);
      setImageFile1(null);
      setImageFile2(null);

      fetchProducts();
      alert("Product added successfully");
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

      {/* ADD PRODUCT */}
      <div className="admin-card">
        <h3>Add Product</h3>

        <div className="form-grid">

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
            className="input-wide"
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

          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          <input type="file" accept="image/*" onChange={(e) => setImageFile1(e.target.files[0])} />
          <input type="file" accept="image/*" onChange={(e) => setImageFile2(e.target.files[0])} />

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

          <button
            className="btn-primary"
            onClick={addProduct}
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="admin-card">
        <h3>Products</h3>

        {products.length === 0 && (
          <p className="muted">No products available</p>
        )}

        {products.map((p) => (
          <div key={p.id} className="product-row">
            <div>
              <b>{p.name}</b>
              <div className="muted">
                Category: {p.categories?.name || "NA"} | Stock: {p.stock}
              </div>
            </div>

            <div>
              ₹{p.price}
              <button
                className="btn-danger"
                onClick={() => deleteProduct(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
            }
