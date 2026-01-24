import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(id))   // 🔒 int8 lock
      .single();

    if (error || !data) {
      setLoading(false);
      setProduct(null);
      return;
    }

    setProduct(data);

    // ✅ Recently Viewed save
    let recent =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    recent = recent.filter(p => p.id !== data.id);

    recent.unshift({
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
    });

    localStorage.setItem(
      "recentProducts",
      JSON.stringify(recent.slice(0, 10))
    );

    fetchRelated(data.category_id, data.id);
    setLoading(false);
  };

  const fetchRelated = async (categoryId, currentId) => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", currentId)
      .eq("status", true)
      .order("id", { ascending: false })
      .limit(6);

    setRelated(data || []);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!product)
    return <p style={{ padding: 20 }}>Product not found</p>;

  return (
    <div style={{ padding: 15 }}>

      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      {/* DETAILS */}
      <h2>{product.name}</h2>

      <h3 style={{ color: "#1a73e8" }}>
        ₹{product.price}
      </h3>

      <p><b>Brand:</b> {product.brand || "-"}</p>
      <p><b>Category:</b> {product.category_name || "Laptop Accessories"}</p>
      <p><b>Part Number:</b> {product.part_number}</p>
      <p><b>Compatible Models:</b> {product.compatible_model}</p>

      {product.description && (
        <>
          <h4>Description</h4>
          <p>{product.description}</p>
        </>
      )}

      {/* BUTTONS */}
      <button
        style={{
          width: "100%",
          padding: 12,
          background: "#ff9800",
          border: "none",
          borderRadius: 6,
          color: "#fff",
          marginTop: 10,
          fontSize: 16,
        }}
      >
        Buy Now
      </button>

      <button
        style={{
          width: "100%",
          padding: 12,
          background: "#1976d2",
          border: "none",
          borderRadius: 6,
          color: "#fff",
          marginTop: 10,
          fontSize: 16,
        }}
      >
        Add to Cart
      </button>

      <a
        href={`https://wa.me/9873670361?text=${encodeURIComponent(
          `Product: ${product.name}\nPrice: ₹${product.price}`
        )}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: 10,
          padding: 12,
          background: "#25d366",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
          fontSize: 16,
        }}
      >
        Order on WhatsApp
      </a>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <>
          <h3 style={{ marginTop: 25 }}>Related Products</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {related.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 10,
                  cursor: "pointer",
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <h4 style={{ fontSize: 14 }}>{p.name}</h4>
                <b>₹{p.price}</b>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
                }
