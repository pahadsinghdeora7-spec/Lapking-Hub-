import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import HomeSlider from "../components/HomeSlider";
import "../styles/theme.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // ================= SEO SAFE =================
    document.title = "Professional Supplier Of Laptop Accessories And Spare Parts Online | LapkingHub";

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Buy laptop accessories online at best price. screen, cable, body, Keyboard, charger, battery, dc jack and laptop spare parts at LapkingHub."
      );
    }

    const metaKeywords = document.querySelector("meta[name='keywords']");
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        "laptop accessories, laptop keyboard, dell keyboard, hp charger, dc jack, laptop screen, lapy speaker, laptop fan, 
        laptop body part, lacd back cover, front bazel, touchpad palmrest, bottom base cover, all laptop spare parts, 
        all laptop brand dell, hp, Lenovo, Acer, Asus, Apple, msi, all accessories available"
      );
    }

    loadProducts();
    loadRecent();
  }, []);

  // ========================
  // LOAD PRODUCTS
  // ========================
  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }
  };

  // ========================
  // LOAD RECENT VIEWED
  // ========================
  const loadRecent = () => {
    try {
      const r = JSON.parse(
        localStorage.getItem("recentProducts") || "[]"
      );
      setRecent(r);
    } catch {
      setRecent([]);
    }
  };

  // ========================
  // DATA SPLIT (LOCKED)
  // ========================
  const newArrivals = products.slice(0, 6);
  const trending = products.slice(6, 12);
  const suggested = products.slice(12, 20);

  return (
    <div className="home">

      {/* ================= SLIDER ================= */}
      <HomeSlider />

      {/* ================= NEW ARRIVALS ================= */}
      <h2 className="section-title">New Arrivals</h2>
      <div className="product-grid">
        {newArrivals.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
          />
        ))}
      </div>

      {/* ================= TRENDING ================= */}
      {trending.length > 0 && (
        <>
          <h2 className="section-title">Trending Products</h2>
          <div className="product-grid">
            {trending.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}
          </div>
        </>
      )}

      {/* ================= RECENTLY VIEWED ================= */}
      {recent.length > 0 && (
        <>
          <h2 className="section-title">Recently Viewed</h2>
          <div className="product-grid">
            {recent.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
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
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
