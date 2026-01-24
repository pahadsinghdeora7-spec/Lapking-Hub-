import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
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
    const r = JSON.parse(localStorage.getItem("recentProducts") || "[]");
    setRecent(r);
  };

  // SAFE slices
  const newArrivals = products.slice(0, 6);
  const trendingProducts = products.slice(6, 12);
  const suggestedProducts = products.slice(12, 20);

  return (
    <div className="home">

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section>
          <h2>New Arrivals</h2>
          <ProductRow items={newArrivals} />
        </section>
      )}

      {/* RECENTLY VIEWED */}
      {recent.length > 0 && (
        <section>
          <h2>Recently Viewed</h2>
          <ProductRow items={recent} />
        </section>
      )}

      {/* TRENDING */}
      {trendingProducts.length > 0 && (
        <section>
          <h2>Trending Products</h2>
          <ProductGrid products={trendingProducts} />
        </section>
      )}

      {/* SUGGESTIONS */}
      {suggestedProducts.length > 0 && (
        <section>
          <h2>Suggestions For You</h2>
          <ProductGrid products={suggestedProducts} />
        </section>
      )}

    </div>
  );
}
