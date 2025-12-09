import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Single admin PIN
const ADMIN_PIN = "9876";

function App() {
  // ---- ADMIN LOGIN STATE (always defined) ----
  const [pinInput, setPinInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinError, setPinError] = useState("");

  // ---- PRODUCT FORM FIELDS (always defined, hooks top pe) ----
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [compatibleModel, setCompatibleModel] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);

  // ---- IMAGE FILES ----
  const [mainImage, setMainImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  // ---- UI STATE ----
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);

  // ---------- HELPER: fetch products ----------
  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }
    setProducts(data || []);
  }

  // ---------- HELPER: upload single image ----------
  async function uploadImage(file) {
    if (!file) return null;

    const filePath = `products/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  }

  // ---------- ADMIN LOGIN HANDLER ----------
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setPinError("");
    } else {
      setPinError("Galat PIN hai.");
    }
  };

  // ---------- PRODUCT SAVE HANDLER ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const mainUrl = await uploadImage(mainImage);
      const url2 = await uploadImage(image2);
      const url3 = await uploadImage(image3);
      const url4 = await uploadImage(image4);

      const { error } = await supabase.from("products").insert({
        name,
        category,
        brand,
        price: price ? Number(price) : null,
        part_number: partNumber,
        compatible_model: compatibleModel,
        description,
        quantity,
        image_main: mainUrl,
        image_2: url2,
        image_3: url3,
        image_4: url4,
      });

      if (error) throw error;

      setMessage("✅ Product saved successfully");

      setName("");
      setCategory("");
      setBrand("");
      setPrice("");
      setPartNumber("");
      setCompatibleModel("");
      setDescription("");
      setQuantity(0);
      setMainImage(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);

      await fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- FETCH PRODUCTS ONLY AFTER LOGIN ----------
  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  // ---------- UI: AGAR ADMIN LOGIN NAHI HUA (PIN SCREEN) ----------
  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            width: 320,
          }}
        >
          <h2 style={{ marginBottom: 10, textAlign: "center" }}>
            Lapking Hub – Admin
          </h2>
          <p
            style={{
              fontSize: 13,
              marginBottom: 16,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Sirf single admin ke liye secure PIN.
          </p>

          <input
            type="password"
            placeholder="Admin PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 10,
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />

          {pinError && (
            <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
              {pinError}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
              backgroundColor: "#2563eb",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Enter Admin Panel
          </button>
        </form>
      </div>
    );
  }

  // ---------- UI: ADMIN PANEL (LOGIN KE BAAD) ----------
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ marginBottom: 4 }}>Lapking Hub – Admin Panel</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
            Single admin: aap hi owner ho 😊
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdmin(false);
            setPinInput("");
          }}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "#fff",
            fontSize: 12,
          }}
        >
          Logout
        </button>
      </div>

      {/* PRODUCT FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 32,
        }}
      >
        <h2 style={{ marginBottom: 12 }}>Add Product</h2>

        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <input
          placeholder="Category (Keyboard, Charger...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <input
          placeholder="Brand / Sub-category (Dell, HP...)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <input
          placeholder="Part Number"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <input
          placeholder="Compatible Model"
          value={compatibleModel}
          onChange={(e) => setCompatibleModel(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <div style={{ marginBottom: 12, display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 8 }}>Quantity:</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => (q > 0 ? q - 1 : 0))}
            style={{ padding: "4px 10px", marginRight: 4 }}
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            style={{ width: 80, textAlign: "center", marginRight: 4, padding: 4 }}
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            style={{ padding: "4px 10px" }}
          >
            +
          </button>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setMainImage(e.target.files ? e.target.files[0] : null)
            }
            style={{ display: "block", marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Extra Image 2 (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage2(e.target.files ? e.target.files[0] : null)
            }
            style={{ display: "block", marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Extra Image 3 (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage3(e.target.files ? e.target.files[0] : null)
            }
            style={{ display: "block", marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Extra Image 4 (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage4(e.target.files ? e.target.files[0] : null)
            }
            style={{ display: "block", marginTop: 4 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#2563eb",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </form>

      <h2 style={{ marginBottom: 12 }}>Products List</h2>
      {products.length === 0 && <p>No products yet. Add your first product.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 8,
            }}
          >
            {p.image_main && (
              <img
                src={p.image_main}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 6,
                  marginBottom: 6,
                }}
              />
            )}
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>{p.name}</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              {p.brand} · {p.category}
            </p>
            <p style={{ fontSize: 13, margin: "4px 0" }}>
              Price: ₹{p.price ?? "-"}
            </p>
            <p style={{ fontSize: 12, margin: "4px 0" }}>
              Qty in stock: {p.quantity ?? 0}
            </p>
            {p.part_number && (
              <p style={{ fontSize: 12, margin: "4px 0" }}>
                Part: {p.part_number}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
