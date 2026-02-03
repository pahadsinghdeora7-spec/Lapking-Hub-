import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import HomeSlider from "../components/HomeSlider";
import { useLoader } from "../context/LoaderContext"; // âœ… ADD
import "./home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [recent, setRecent] = useState([]);

  const { setLoading } = useLoader(); // âœ… ADD

  useEffect(() => {
    // ================= SEO (100% SAFE) =================
    document.title =
      "Laptop Accessories & Spare Parts Online | LapkingHub India";

    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }

    metaDesc.content =
      "Buy laptop accessories and spare parts online in India. Keyboard, charger, battery, screen, DC jack, fan, speaker and all laptop parts available at best price on LapkingHub.";

    let metaKeywords = document.querySelector("meta[name='keywords']");
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }

    metaKeywords.content =
      "laptop accessories, laptop spare parts, laptop keyboard, laptop charger, laptop battery, dc jack, laptop screen, dell hp lenovo acer asus spare parts";

    loadProducts();
    loadRecent();
  }, []);

  // ========================
  // LOAD PRODUCTS
  // ========================
  const loadProducts = async () => {
    setLoading(true); // âœ… START LOADER

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false); // âœ… STOP LOADER
  };

  // ========================
  // LOAD RECENT VIEWED
  // ========================
  const loadRecent = () => {
    try {
      const r = JSON.parse(localStorage.getItem("recentProducts") || "[]");
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

      {/* ================= H1 (SEO REQUIRED â€” hidden) ================= */}
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          height: "1px",
          width: "1px",
          overflow: "hidden",
        }}
      >
        Laptop Accessories and Spare Parts Online Store in India
      </h1>

      {/* ================= SEO TEXT ================= */}
      <p
        style={{
          position: "absolute",
          left: "-9999px",
          height: "1px",
          width: "1px",
          overflow: "hidden",
        }}
      >
        LapkingHub is a professional supplier of laptop accessories and spare
        parts in India. Buy laptop keyboard, charger, battery, DC jack, screen,
        speaker, fan and all laptop parts for Dell, HP, Lenovo, Acer, Asus and
        other brands at best price online.
      </p>

      {/* ================= SLIDER ================= */}
      <HomeSlider />

      {/* ================= NEW ARRIVALS ================= */}
      <h2 className="section-title">New Arrivals</h2>
      <div className="product-grid">
        {newArrivals.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

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

      {/* ================= RECENTLY VIEWED ================= */}
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
