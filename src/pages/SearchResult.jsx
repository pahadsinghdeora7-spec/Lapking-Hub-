import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function SearchResult() {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [keyword]);

  const loadResults = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .ilike("search_text", `%${keyword.toLowerCase()}%`)
      .eq("status", true)
      .limit(50);

    setProducts(data || []);
    setLoading(false);
  };

  return (
    <div className="home">
      <h2 className="section-title">
        Search results for: "{keyword}"
      </h2>

      {loading ? (
        <p style={{ padding: 20 }}>Searching...</p>
      ) : products.length === 0 ? (
        <p style={{ padding: 20 }}>No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
