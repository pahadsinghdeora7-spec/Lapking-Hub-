import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category_slug: "",
    brand: "",
    part_number: "",
    price: "",
    stock: "",
    description: "",
    compatible_model: "",
    image: "",
    image1: "",
    image2: "",
    status: true
  });

  // ================= FETCH =================
  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= IMAGE UPLOAD =================
  const uploadImage = async (file) => {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${ext}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      alert("Image upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ================= OPEN POPUP =================
  const openProduct = (item) => {
    setSelected(item);

    setForm({
      name: item.name || "",
      category_slug: item.category_slug || "",
      brand: item.brand || "",
      part_number: item.part_number || "",
      price: item.price || "",
      stock: item.stock || "",
      description: item.description || "",
      compatible_model: item.compatible_model || "",
      image: item.image || "",
      image1: item.image1 || "",
      image2: item.image2 || "",
      status: item.status ?? true
    });

    setImageFile(null);
    setImageFile1(null);
    setImageFile2(null);
  };

  // ================= UPDATE =================
  const updateProduct = async () => {

    let image = form.image;
    let image1 = form.image1;
    let image2 = form.image2;

    if (imageFile) image = await uploadImage(imageFile);
    if (imageFile1) image1 = await uploadImage(imageFile1);
    if (imageFile2) image2 = await uploadImage(imageFile2);

    await supabase
      .from("products")
      .update({
        ...form,
        image,
        image1,
        image2
      })
      .eq("id", selected.id);

    setSelected(null);
    fetchProducts();
  };

  // ================= DELETE =================
  const deleteProduct = async () => {
    if (!window.confirm("Delete this product?")) return;

    await supabase
      .from("products")
      .delete()
      .eq("id", selected.id);

    setSelected(null);
    fetchProducts();
  };

  return (
    <div className="admin-products">

      <h2>Products</h2>

      {/* ================= PRODUCT LIST ================= */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Part No</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="8">Loading...</td>
              </tr>
            )}

            {!loading && products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img src={p.image} className="thumb" />
                  ) : (
                    <div className="no-img">No Image</div>
                  )}
                </td>

                <td>{p.name}</td>
                <td>{p.category_slug || "-"}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.part_number || "-"}</td>
                <td>₹{p.price || 0}</td>
                <td>{p.stock || 0}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => openProduct(p)}
                  >
                    View / Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= POPUP ================= */}
      {selected && (
        <div className="modal-bg">
          <div className="modal">

            <h3>Edit Product</h3>

            <label>Product Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label>Category</label>
            <input
              value={form.category_slug}
              onChange={(e) =>
                setForm({ ...form, category_slug: e.target.value })
              }
            />

            <label>Brand</label>
            <input
              value={form.brand}
              onChange={(e) =>
                setForm({ ...form, brand: e.target.value })
              }
            />

            <label>Part Number</label>
            <input
              value={form.part_number}
              onChange={(e) =>
                setForm({ ...form, part_number: e.target.value })
              }
            />

            <label>Compatible Model</label>
            <textarea
              rows="3"
              value={form.compatible_model}
              onChange={(e) =>
                setForm({ ...form, compatible_model: e.target.value })
              }
            />

            <label>Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <label>Main Image</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

            <label>Image 1</label>
            <input type="file" onChange={(e) => setImageFile1(e.target.files[0])} />

            <label>Image 2</label>
            <input type="file" onChange={(e) => setImageFile2(e.target.files[0])} />

            <div className="modal-actions">
              <button className="save" onClick={updateProduct}>
                Update
              </button>

              <button className="delete" onClick={deleteProduct}>
                Delete
              </button>

              <button className="close" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
