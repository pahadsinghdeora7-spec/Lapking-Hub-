import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);

    const productId = Number(id); // 🔥 MOST IMPORTANT FIX

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        price,
        image,
        description,
        part_number,
        compatible_m,
        brand,
        categories (
          name
        )
        `
      )
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Product fetch error:", error);
      setLoading(false);
      return;
    }

    setProduct(data);
    setLoading(false);
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  if (!product) {
    return <p style={{ padding: 20 }}>Product not found</p>;
  }

  return (
    <div style={{ padding: 16 }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", borderRadius: 10 }}
      />

      <h2>{product.name}</h2>

      <h3>₹{product.price}</h3>

      <p><b>Brand:</b> {product.brand}</p>

      <p>
        <b>Category:</b>{" "}
        {product.categories?.name || "N/A"}
      </p>

      <p><b>Part Number:</b> {product.part_number}</p>

      <p><b>Compatible Models:</b></p>
      <p>{product.compatible_m}</p>

      <p><b>Description:</b></p>
      <p>{product.description}</p>

      <button
        style={{
          width: "100%",
          padding: 12,
          background: "#ff9800",
          color: "#fff",
          border: "none",
          marginTop: 10,
        }}
      >
        Buy Now
      </button>

      <button
        style={{
          width: "100%",
          padding: 12,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          marginTop: 10,
        }}
      >
        Add to Cart
      </button>

      <a
        href={`https://wa.me/919873670361?text=I want to buy ${product.name}`}
        target="_blank"
        rel="noreferrer"
      >
        <button
          style={{
            width: "100%",
            padding: 12,
            background: "green",
            color: "#fff",
            border: "none",
            marginTop: 10,
          }}
        >
          Order on WhatsApp
        </button>
      </a>
    </div>
  );
}
