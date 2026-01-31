import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "../styles/theme.css";

/* ===============================
   SEARCH NORMALIZER
   dc-65w / DC65W / dc_65w → dc65w
================================= */
function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export default function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) searchProducts();
  }, [query]);

  const searchProducts = async () => {
    setLoading(true);

    const searchKey = normalize(query);

    // 🔥 Load all products (safe & fast)
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // ✅ SMART FILTER
    const result = data.filter((p) => {
      const name = normalize(p.name);
      const brand = normalize(p.brand);
      const part = normalize(p.part_no);
      const model = normalize(p.compatible_model || "");

      return (
        name.includes(searchKey) ||
        brand.includes(searchKey) ||
        part.includes(searchKey) ||
        model.includes(searchKey)
      );
    });

    setProducts(result);
    setLoading(false);
  };

  return (
    <div className="home">

      <h2 className="section-title">
        🔍 Search results for: <span style={{ color: "#1976ff" }}>{query}</span>
      </h2>

      {loading && <p>Searching products...</p>}

      {!loading && products.length === 0 && (
        <div style={{ padding: 20, color: "#777" }}>
          <p>No products found.</p>
          <p style={{ fontSize: 13 }}>
            Try searching by product name, brand, part number or model.
          </p>
        </div>
      )}

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
            }
