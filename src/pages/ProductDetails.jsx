import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import ProductCard from "../components/ProductCard";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
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

    if (!data) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(data);

    // related products
    const { data: rel } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", data.category_slug)
      .neq("id", data.id)
      .limit(12);

    setRelated(rel || []);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!product)
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        ❌ Product not found
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{product.name} | LapkingHub</title>
        <meta
          name="description"
          content={`${product.name} ${product.part_number || ""}. Buy genuine laptop spare parts online.`}
        />
      </Helmet>

      <div className="pd-container">
        <h1>{product.name}</h1>

        <img src={product.image} alt={product.name} />

        <h2>₹{product.price}</h2>

        <p>{product.description}</p>

        {related.length > 0 && (
          <>
            <h3>Related Products</h3>
            <div className="related-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
