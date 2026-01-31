import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Search.css";

/* ================= UTILS ================= */
function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Search() {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [queryParam]);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active");

    if (!error && data) {
      const searchText = normalize(queryParam);

      const filtered = data.filter((p) => {
        const searchableText = normalize(
          `
          ${p.name}
          ${p.brand}
          ${p.part_no}
          ${p.compatible_model}
          ${p.category}
          ${p.keywords}
        `
        );

        return searchableText.includes(searchText);
      });

      setProducts(filtered);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 15 }}>

      <h3 style={{ marginBottom: 10 }}>
        🔍 Search results for: <b>{queryParam}</b>
      </h3>

      {/* ================= LOADING ================= */}
      {loading && <p>⏳ Searching products...</p>}

      {/* ================= NO RESULT ================= */}
      {!loading && products.length === 0 && (
        <div style={{ marginTop: 30, textAlign: "center", color: "#777" }}>
          <h4>No products found</h4>
          <p>
            Try searching with:
            <br />
            product name, brand, part number or model
          </p>
        </div>
      )}

      {/* ================= PRODUCTS ================= */}
      <div className="search-grid">

        {products.map((p) => (
          <div key={p.id} className="search-card">

            <img
              src={p.image || "/no-image.png"}
              alt={p.name}
              className="search-img"
            />

            <h4 className="search-name">{p.name}</h4>

            {p.brand && (
              <p className="search-meta">
                <b>Brand:</b> {p.brand}
              </p>
            )}

            {p.part_no && (
              <p className="search-meta">
                <b>Part No:</b> {p.part_no}
              </p>
            )}

            {p.compatible_model && (
              <p className="search-meta">
                <b>Compatible:</b> {p.compatible_model}
              </p>
            )}

            <div className="search-price">₹{p.price}</div>

            <button className="search-btn">
              View Product
            </button>

          </div>
        ))}

      </div>

    </div>
  );
            }
