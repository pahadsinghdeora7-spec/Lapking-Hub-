import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    loadProducts();
    loadRecent();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  };

  const loadRecent = () => {
    const r = JSON.parse(
      localStorage.getItem("recentProducts") || "[]"
    );
    setRecent(r);
  };

  // 🔒 DATA SLICES (safe)
  const newArrivals = products.slice(0, 6);
  const trending = products.slice(6, 12);
  const suggested = products.slice(12, 20);

  return (
    <div className="home">

      {/* NEW ARRIVALS (always show) */}
      <Section title="New Arrivals">
        <ProductRow items={newArrivals} />
      </Section>

      {/* RECENTLY VIEWED */}
      {recent.length > 0 && (
        <Section title="Recently Viewed">
          <ProductRow items={recent} />
        </Section>
      )}

      {/* RELATED PRODUCTS */}
      {newArrivals.length > 0 && (
        <>
          <h2>Related Products</h2>
          <ProductGrid products={newArrivals} />
        </>
      )}

      {/* TRENDING PRODUCTS */}
      {trending.length > 0 && (
        <>
          <h2>Trending Products</h2>
          <ProductGrid products={trending} />
        </>
      )}

      {/* SUGGESTIONS */}
      {suggested.length > 0 && (
        <>
          <h2>Suggestions For You</h2>
          <ProductGrid products={suggested} />
        </>
      )}

    </div>
  );
}

/* 🔒 SECTION COMPONENT (UNCHANGED) */
function Section({ title, children }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
