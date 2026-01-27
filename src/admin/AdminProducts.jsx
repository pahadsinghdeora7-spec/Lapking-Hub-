import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
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
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  // ================= IMAGE UPLOAD =================

  const uploadImage = async (file) => {
    if (!file) return "";

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) return "";

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ================= SAVE / UPDATE =================

  const saveProduct = async () => {
    if (!form.name || !form.price) {
      alert("Product name & price required");
      return;
    }

    setLoading(true);

    let img = "";
    let img1 = "";
    let img2 = "";

    if (image) img = await uploadImage(image);
    if (image1) img1 = await uploadImage(image1);
    if (image2) img2 = await uploadImage(image2);

    const payload = {
      category_id: form.category_id || null,
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      part_number: form.part_number,
      compatible_model: form.compatible_model,
      description: form.description,
    };

    if (img) payload.image = img;
    if (img1) payload.image1 = img1;
    if (img2) payload.image2 = img2;

    let result;

    if (editId) {
      // UPDATE
      result = await supabase
        .from("products")
        .update(payload)
        .eq("id", editId);
    } else {
      // INSERT
      result = await supabase.from("products").insert([payload]);
    }

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      alert(editId ? "✅ Product updated" : "✅ Product added");

      setEditId(null);
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

      fetchProducts();
    }
  };

  // ================= EDIT =================

  const editProduct = (p) => {
    setEditId(p.id);
    setForm({
      category_id: p.category_id || "",
      name: p.name || "",
      price: p.price || "",
      stock: p.stock || "",
      part_number: p.part_number || "",
      compatible_model: p.compatible_model || "",
      description: p.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* PRODUCT LIST */}
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
                      border: "1px solid #ddd",
                      borderRadius: 6,
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
                <button onClick={() => editProduct(p)}>Edit</button>{" "}
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD / EDIT FORM */}
      <h3 style={{ marginTop: 30 }}>
        {editId ? "Edit Product" : "Add Product"}
      </h3>

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

      <button onClick={saveProduct} disabled={loading}>
        {loading
          ? "Saving..."
          : editId
          ? "Update Product"
          : "Save Product"}
      </button>
    </div>
  );
      }
