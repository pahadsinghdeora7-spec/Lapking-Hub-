import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import HomeSlider from "../components/HomeSlider";
import "../styles/theme.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    loadProducts();
    loadRecent();
    window.scrollTo(0, 0);
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", true)
      .order("created_at", { ascending: false });

    setProducts(data || []);
  };

  const loadRecent = () => {
    try {
      setRecent(
        JSON.parse(localStorage.getItem("recentProducts") || "[]")
      );
    } catch {
      setRecent([]);
    }
  };

  const newArrivals = products.slice(0, 6);
  const trending = products.slice(6, 12);
  const suggested = products.slice(12, 20);

  return (
    <div className="home">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>
         Professional Supplier Of Laptop Accessories And Spare Parts Online | LapkingHub India
        </title>

        <meta
          name="description"
          content="Buy laptop accessories online at best price. Keyboard, charger, battery, screen, body, hinges,and all laptop spare parts available at LapkingHub."
        />

        <meta
          name="keywords"
          content="laptop accessories, laptop keyboard, laptop charger, dc jack, dell keyboard, hp keyboard, laptop fan, laptop screen,hp laptop speaker, laptop spare parts, laptop all accessories available"
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="LapkingHub – Laptop Accessories Store" />
        <meta
          property="og:description"
          content="India's trusted laptop accessories store. Order via WhatsApp."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lapking-hub.pages.dev" />
        <meta property="og:image" content="/logo.png" />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://lapking-hub.pages.dev/"
        />
      </Helmet>

      {/* ================= SLIDER ================= */}
      <HomeSlider />

      {/* ================= NEW ARRIVALS ================= */}
      {newArrivals.length > 0 && (
        <>
          <h2 className="section-title">New Arrivals</h2>
          <div className="product-grid">
            {newArrivals.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </>
      )}

      {/* ================= TRENDING ================= */}
      {trending.length > 0 && (
        <>
          <h2 className="section-title">Trending Products</h2>
          <div className="product-grid">
            {trending.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </>
      )}

      {/* ================= RECENT ================= */}
      {recent.length > 0 && (
        <>
          <h2 className="section-title">Recently Viewed</h2>
          <div className="product-grid">
            {recent.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </>
      )}

      {/* ================= SUGGESTED ================= */}
      {suggested.length > 0 && (
        <>
          <h2 className="section-title">Suggestions For You</h2>
          <div className="product-grid">
            {suggested.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
