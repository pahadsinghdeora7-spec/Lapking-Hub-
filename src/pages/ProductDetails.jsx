import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    setLoading(true);

    // 🔥 fetch all slugs and match safely
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", true);

    if (!data || data.length === 0) {
      setLoading(false);
      return;
    }

    const found = data.find(
      (p) => p.slug?.trim() === slug?.trim()
    );

    if (!found) {
      setProduct(null);
    } else {
      setProduct(found);

      // SEO
      document.title = `${found.name} | LapkingHub`;
    }

    setLoading(false);
  }

  if (loading)
    return <div style={{ padding: 30 }}>Loading...</div>;

  if (!product)
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        ❌ Product not found
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.name}</h1>
      <p>Part No: {product.part_number}</p>
      <h2>₹{product.price}</h2>
      <p>{product.description}</p>
    </div>
  );
}
