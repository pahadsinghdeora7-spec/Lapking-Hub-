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
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  async function loadProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", true)
      .limit(1);

    console.log("URL slug:", slug);
    console.log("DB result:", data);

    if (error || !data || data.length === 0) {
      setProduct(null);
    } else {
      setProduct(data[0]);
    }

    setLoading(false);
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        Loading product...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <div style={{ padding: 30, textAlign: "center", color: "red" }}>
        ❌ Product not found
      </div>
    );
  }

  return (
    <div className="pd-container">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          {product.name} | Buy Online at Best Price | LapkingHub
        </title>

        <meta
          name="description"
          content={`${product.name} ${product.part_number || ""}. Genuine laptop spare parts online. Compatible with Dell, HP, Lenovo laptops.`}
        />
      </Helmet>

      {/* ================= PRODUCT ================= */}
      <h1 className="pd-title">{product.name}</h1>

      <p>
        <strong>Brand:</strong> {product.brand}
      </p>

      <p>
        <strong>Part No:</strong> {product.part_number}
      </p>

      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          maxWidth: "320px",
          margin: "15px 0"
        }}
      />

      <h2 className="pd-price">₹{product.price}</h2>

      <p className="pd-desc">
        {product.description}
      </p>

      <p>
        <strong>Compatible Models:</strong>
        <br />
        {product.compatible_model}
      </p>

      <a
        href={`https://wa.me/919873670361?text=I want ${product.name} (${product.part_number})`}
        target="_blank"
        className="wa-btn"
      >
        💬 Order on WhatsApp
      </a>

    </div>
  );
}
