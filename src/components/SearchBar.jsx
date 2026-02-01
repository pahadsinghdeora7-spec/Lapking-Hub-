import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./Search.css";

export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= CLEAN SEARCH TEXT =================
  function cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  useEffect(() => {
    if (!keyword) return;

    searchProducts();
    window.scrollTo(0, 0);
  }, [keyword]);

  // ================= SEARCH ENGINE =================
  async function searchProducts() {
    setLoading(true);

    const cleanQuery = cleanText(keyword);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("search_text", `%${cleanQuery}%`)
      .limit(100);

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="search-page">

      {/* ================= SEO ================= */}
      <title>
        Search results for {keyword} | LapkingHub
      </title>

      <h2 className="search-title">
        Search results for: <span>{keyword}</span>
      </h2>

      {loading && (
        <div className="search-loading">
          Searching products...
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="search-empty">
          ❌ No products found
        </div>
      )}

      <div className="search-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </div>
  );
}
