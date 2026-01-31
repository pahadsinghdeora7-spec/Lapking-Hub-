import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      loadSearch();
    }
  }, [query]);

  async function loadSearch() {
    setLoading(true);

    const text = query
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, " ")
      .trim();

    const { data } = await supabase.from("products").select("*");

    const filtered =
      data?.filter((p) => {
        const fullText = `
          ${p.name || ""}
          ${p.brand || ""}
          ${p.part_no || ""}
          ${p.model || ""}
        `
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, " ");

        return fullText.includes(text);
      }) || [];

    setProducts(filtered);
    setLoading(false);
  }

  return (
    <div style={{ padding: 15 }}>

      <h3 style={{ marginBottom: 12 }}>
        🔍 Search results for: <b>{query}</b>
      </h3>

      {loading && <p>Searching products...</p>}

      {!loading && products.length === 0 && (
        <p style={{ color: "#777" }}>
          No products found
        </p>
      )}

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
}
