import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  async function fetchProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .limit(1)
      .single();

    console.log("URL slug:", slug);
    console.log("DB product:", data);

    if (!data || error) {
      setProduct(null);
    } else {
      setProduct(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: 30, textAlign: "center", color: "red" }}>
        ❌ Product not found
      </div>
    );
  }

  return (
    <div className="pd-container">

      {/* SEO */}
      <Helmet>
        <title>{product.name} | LapkingHub</title>
        <meta
          name="description"
          content={`${product.name} ${product.part_number || ""} buy online at best price from LapkingHub.`}
        />
      </Helmet>

      <h1>{product.name}</h1>

      <p>Part No: {product.part_number || "-"}</p>

      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", maxWidth: 300 }}
      />

      <h2>₹{product.price}</h2>

      <p>{product.description}</p>

    </div>
  );
}
