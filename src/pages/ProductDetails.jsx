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

  const fetchProduct = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(id))   // ✅ VERY IMPORTANT
      .single();

    if (error) {
      console.log("Product error:", error);
      setProduct(null);
    } else {
      setProduct(data);
    }

    setLoading(false);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!product)
    return <p style={{ padding: 20 }}>Product not found</p>;

  return (
    <div style={{ padding: 15 }}>

      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          maxHeight: 300,
          objectFit: "cover",
          borderRadius: 10
        }}
      />

      <h2>{product.name}</h2>

      <h3>₹{product.price}</h3>

      <p><b>Brand:</b> {product.brand}</p>

      <p><b>Part Number:</b> {product.part_number}</p>

      <p><b>Compatible Models:</b> {product.compatible_models}</p>

      <p>{product.description}</p>

      <a
        href={`https://wa.me/919873670361?text=I want to order ${product.name}`}
        target="_blank"
        rel="noreferrer"
      >
        <button style={{
          width: "100%",
          padding: 12,
          background: "green",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}>
          Order on WhatsApp
        </button>
      </a>

    </div>
  );
}
