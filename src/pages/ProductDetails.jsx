import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    // 🔹 MAIN PRODUCT
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(data);

    // 🔹 RELATED PRODUCTS (same category)
    const { data: relatedData } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", data.category_id)
      .neq("id", data.id)
      .limit(8);

    setRelated(relatedData || []);
    setLoading(false);
  };

  // ================= UI =================

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  if (!product) {
    return <p style={{ padding: 20 }}>Product not found</p>;
  }

  return (
    <div style={{ padding: 16 }}>
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          maxHeight: 300,
          objectFit: "contain",
          borderRadius: 10,
        }}
      />

      {/* DETAILS */}
      <h2>{product.name}</h2>
      <h3>₹{product.price}</h3>

      <p><b>Brand:</b> {product.brand || "-"}</p>
      <p><b>Category:</b> {product.category_name || ""}</p>
      <p><b>Part Number:</b> {product.part_number || "-"}</p>
      <p><b>Compatible Models:</b> {product.compatible_model || "-"}</p>

      <p style={{ marginTop: 10 }}>
        <b>Description:</b><br />
        {product.description || "No description available"}
      </p>

      {/* BUTTONS */}
      <button
        style={{
          width: "100%",
          padding: 12,
          marginTop: 12,
          background: "#ff9800",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
        }}
      >
        Buy Now
      </button>

      <button
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
        }}
      >
        Add to Cart
      </button>

      <a
        href={`https://wa.me/919873670361?text=I want to order ${product.name}`}
        target="_blank"
        rel="noreferrer"
      >
        <button
          style={{
            width: "100%",
            padding: 12,
            marginTop: 10,
            background: "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
          }}
        >
          Order on WhatsApp
        </button>
      </a>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <>
          <h3 style={{ marginTop: 30 }}>Related Products</h3>

          {related.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12,
                borderBottom: "1px solid #eee",
                paddingBottom: 10,
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 70, height: 70, objectFit: "contain" }}
              />

              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                <p style={{ margin: 0 }}>₹{item.price}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
