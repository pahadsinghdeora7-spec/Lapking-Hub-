import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [pinEntered, setPinEntered] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const ADMIN_PIN = "4321";

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    partNumber: "",
    compatibleModel: "",
    description: "",
    quantity: 0,
  });

  const [mainImage, setMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  // --------- helpers ---------
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleQuantityChange = (delta) => {
    setForm((f) => ({
      ...f,
      quantity: Math.max(0, (parseInt(f.quantity || 0, 10) || 0) + delta),
    }));
  };

  const handleExtraImageChange = (index, file) => {
    setExtraImages((imgs) => {
      const copy = [...imgs];
      copy[index] = file;
      return copy;
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      brand: "",
      price: "",
      partNumber: "",
      compatibleModel: "",
      description: "",
      quantity: 0,
    });
    setMainImage(null);
    setExtraImages([null, null, null]);
  };

  // --------- load products on start ---------
  useEffect(() => {
    if (pinEntered) {
      fetchProducts();
    }
  }, [pinEntered]);

  const fetchProducts = async () => {
    setError("");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch products error:", error);
      setError(error.message);
      return;
    }
    setProducts(data || []);
  };

  // ---- image upload helper ----
  const uploadImage = async (file) => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(fileName);

    return publicUrl;
  };

  // --------- save product ---------
  const handleSave = async () => {
    setError("");

    if (!form.name || !form.category || !form.brand || !form.price) {
      setError("Name, Category, Brand, Price required hai.");
      return;
    }

    if (!mainImage) {
      setError("Main image zaroori hai.");
      return;
    }

    setLoading(true);
    try {
      // 1) upload main image + extras
      const [mainUrl, img2, img3, img4] = await Promise.all([
        uploadImage(mainImage),
        uploadImage(extraImages[0]),
        uploadImage(extraImages[1]),
        uploadImage(extraImages[2]),
      ]);

      // 2) insert product row
      const { error: insertError } = await supabase.from("products").insert({
        name: form.name,
        category: form.category,
        brand: form.brand,
        price: parseFloat(form.price || 0),
        part_number: form.partNumber,
        compatible_model: form.compatibleModel,
        description: form.description,
        quantity: parseInt(form.quantity || 0, 10) || 0,
        image_main: mainUrl,
        image_2: img2,
        image_3: img3,
        image_4: img4,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error("Save product failed:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --------- PIN screen ---------
  if (!pinEntered) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
        <h2>Lapking Hub – Admin Login</h2>
        <p>Sirf aapke liye private PIN login 😊</p>
        <input
          type="password"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="Enter admin PIN"
          style={{ padding: 8, width: "100%", marginBottom: 12 }}
        />
        <button
          onClick={() => {
            if (pinInput === ADMIN_PIN) {
              setPinEntered(true);
              setPinInput("");
            } else {
              alert("Galat PIN");
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  // --------- MAIN ADMIN UI ---------
  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1>Lapking Hub – Admin Panel</h1>
        <button onClick={() => setPinEntered(false)}>Logout</button>
      </header>
      <p style={{ marginTop: -10, marginBottom: 20 }}>
        Single admin: aap hi owner ho 😊
      </p>

      {/* Add Product form */}
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2>Add Product</h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", margin: "6px 0", padding: 6 }}
        />
        <input
          name="category"
          placeholder="Category (Keyboard, Charger…)"
          value={form.category}
          onChange={handleChange}
          style={{ width: "100%", margin: "6px 0", padding: 6 }}
        />
        <input
          name="brand"
          placeholder="Brand / Sub-category (Dell, HP…)"
          value={form.brand}
          onChange={handleChange}
          style={{ width: "100%", margin: "6px 0", padding: 6 }}
        />
        <input
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          style={{ width: "100%", margin: "6px 0", padding: 6 }}
        />
        <input
          name="partNumber"
          placeholder="Part Number"
          value={form.partNumber}
          onChange={handleChange}
          style={{ width: "100%", margin: "6px 0", padding: 6 }}
        />
        <input
          name="compatibleModel"
          placeholder="Compatible Model"
          value={form.compatibleModel}
          onChange={handleChange}
          style={{ width: "100%", margin: "6px 0", padding: 6 }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          style={{ width: "100%", margin: "6px 0", padding: 6 }}
        />

        <div style={{ margin: "10px 0" }}>
          <span>Quantity:&nbsp;</span>
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <input
            type="number"
            value={form.quantity}
            readOnly
            style={{ width: 60, textAlign: "center", margin: "0 8px" }}
          />
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>

        <div style={{ margin: "10px 0" }}>
          <div>
            <strong>Main Image:</strong>{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0] || null)}
            />
          </div>
          <div>
            <strong>Extra Image 2 (optional):</strong>{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleExtraImageChange(0, e.target.files[0])}
            />
          </div>
          <div>
            <strong>Extra Image 3 (optional):</strong>{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleExtraImageChange(1, e.target.files[0])}
            />
          </div>
          <div>
            <strong>Extra Image 4 (optional):</strong>{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleExtraImageChange(2, e.target.files[0])}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 8 }}>Error: {error}</div>
        )}

        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
      </section>

      {/* Products list */}
      <section>
        <h2>Products List</h2>
        {products.length === 0 ? (
          <p>No products yet. Add your first product.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {products.map((p) => (
              <li
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                  display: "flex",
                  gap: 12,
                }}
              >
                {p.image_main && (
                  <img
                    src={p.image_main}
                    alt={p.name}
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                )}
                <div>
                  <strong>{p.name}</strong>
                  <div>
                    {p.brand} • {p.category}
                  </div>
                  <div>₹{p.price}</div>
                  <div>Qty: {p.quantity}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
