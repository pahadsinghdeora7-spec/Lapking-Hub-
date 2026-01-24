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

    const productId = Number(id);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error(error);
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

      <p><b>Part Number:</b> {product.part_number}</p>

      <p><b>Compatible Models:</b></p>
      <p>{product.compatible_m}</p>

      <p><b>Description:</b></p>
      <p>{product.description}</p>

      {/* Buttons */}
      <button style={btn("#ff9800")}>Buy Now</button>
      <button style={btn("#1976d2")}>Add to Cart</button>

      <a
        href={`https://wa.me/919873670361?text=I want ${product.name}`}
        target="_blank"
        rel="noreferrer"
      >
        <button style={btn("green")}>Order on WhatsApp</button>
      </a>
    </div>
  );
}

function btn(color) {
  return {
    width: "100%",
    padding: 12,
    background: color,
    color: "#fff",
    border: "none",
    marginTop: 10,
    borderRadius: 6,
    fontSize: 16,
  };
}
