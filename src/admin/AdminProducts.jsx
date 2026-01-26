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

  // ================= LOAD =================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("id", { ascending: false });

    if (!error) setProducts(data || []);
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
      alert("Category, Name, Price required");
      return;
    }

    setLoading(true);

    const img = await uploadImage(image);
    const img1 = await uploadImage(image1);
    const img2 = await uploadImage(image2);

    const { error } = await supabase.from("products").insert([
      {
        category_id: Number(form.category_id),
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
      return;
    }

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

    fetchProducts();
  };

  // ================= DELETE =================

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ================= UI =================

  return (
    <div>
      <h2>Products</h2>

      <button onClick={addProduct} disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </button>

      <hr />

      <h3>Product List</h3>

      {products.length === 0 && <p>No products</p>}

      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: 12 }}>
          <b>{p.name}</b> — ₹{p.price}
          <br />
          Stock: {p.stock}
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
