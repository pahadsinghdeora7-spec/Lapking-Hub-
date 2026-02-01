import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
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

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!data || error) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(data);

    // related
    const { data: rel } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", data.category_slug)
      .neq("id", data.id)
      .limit(8);

    setRelated(rel || []);
    setLoading(false);
  }

  if (loading) return <div className="pd-loading">Loading...</div>;

  if (!product)
    return (
      <div className="pd-not-found">
        ❌ Product not found
      </div>
    );

  return (
    <div className="pd-container">

      {/* SEO */}
      <Helmet>
        <title>{product.name} | LapkingHub</title>
        <meta
          name="description"
          content={`${product.name} ${product.part_number || ""}. Buy genuine laptop spare parts online at best price.`}
        />
      </Helmet>

      <h1>{product.name}</h1>

      <p><b>Brand:</b> {product.brand}</p>
      <p><b>Part No:</b> {product.part_number}</p>

      <h2>₹{product.price}</h2>

      <p>{product.description}</p>

      {related.length > 0 && (
        <>
          <h3>Related Products</h3>
          <div className="related-grid">
            {related.map(p => (
              <div
                key={p.id}
                className="related-card"
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                <img src={p.image} alt={p.name} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
