import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { slug } = useParams();

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
      .limit(1)
      .maybeSingle();

    if (!data) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(data);

    // ✅ SEO
    document.title = `${data.name} | LapkingHub`;

    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = `${data.name} ${data.part_number || ""} laptop spare part available at LapkingHub`;

    const { data: rel } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", data.category_slug)
      .neq("id", data.id)
      .limit(8);

    setRelated(rel || []);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  if (!product)
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        ❌ Product not found
      </div>
    );

  return (
    <div className="pd-container">
      <h1>{product.name}</h1>
      <p>Part No: {product.part_number}</p>
      <h2>₹{product.price}</h2>

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
  );
}
