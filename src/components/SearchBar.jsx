import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./SearchBar.css";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);

  // ===============================
  // SMART SEARCH (NAME + BRAND + PART NO)
  // ===============================
  async function searchProducts(text) {
    setLoading(true);

    const keyword = text
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, " ")
      .trim();

    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (!error && data) {
      const filtered = data.filter((p) => {
        const combined =
          `${p.name || ""} ${p.brand || ""} ${p.part_no || ""} ${p.model || ""}`
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, " ");

        return combined.includes(keyword);
      });

      setProducts(filtered);
    }

    setLoading(false);
  }

  return (
    <div className="search-page">

      {/* HEADER */}
      <div className="search-title">
        🔍 Search results for: <b>{query}</b>
      </div>

      {/* LOADING */}
      {loading && <p className="search-loading">Searching products...</p>}

      {/* NO RESULT */}
      {!loading && products.length === 0 && (
        <div className="search-empty">
          <p>No products found</p>
          <span>
            Try searching by product name, brand, part number or model
          </span>
        </div>
      )}

      {/* RESULTS */}
      <div className="search-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
}
