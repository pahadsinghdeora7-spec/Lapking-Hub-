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
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  async function loadProduct() {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    setProduct(data || null);
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loading">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="pd-notfound">
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
          content={`${product.name} ${
            product.part_number || ""
          } buy online at best price. Genuine laptop accessories and spare parts for HP, Dell, Lenovo and Acer at LapkingHub.`}
        />
      </Helmet>

      {/* ================= PRODUCT ================= */}
      <h1 className="pd-title">{product.name}</h1>

      <p className="pd-part">
        Part No: {product.part_number || "N/A"}
      </p>

      <img
        src={product.image}
        alt={product.name}
        className="pd-image"
      />

      <h2 className="pd-price">₹{product.price}</h2>

      <p className="pd-desc">
        {product.description ||
          "High quality genuine laptop spare part with perfect compatibility."}
      </p>

      <p className="pd-stock">
        {product.stock > 0
          ? "✅ In Stock"
          : "❌ Out of Stock"}
      </p>

      <a
        className="pd-whatsapp"
        target="_blank"
        href={`https://wa.me/919873670361?text=I want ${product.name} | Part No: ${product.part_number}`}
      >
        💬 Order on WhatsApp
      </a>

    </div>
  );
}
