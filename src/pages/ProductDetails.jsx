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
      .eq("id", Number(id))
      .single();

    if (!error) {
      setProduct(data);
    }

    setLoading(false);
  };

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
        style={{
          width: "100%",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      <h2>{product.name}</h2>

      {product.compatible_model && (
        <p>
          <strong>Compatible:</strong> {product.compatible_model}
        </p>
      )}

      <h3>₹{product.price}</h3>

      <p style={{ marginTop: 10 }}>{product.description}</p>
    </div>
  );
}
