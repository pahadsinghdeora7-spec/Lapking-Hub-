import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import HomeSlider from "../components/HomeSlider";
import { useLoader } from "../context/LoaderContext";
import "./home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [recent, setRecent] = useState([]);

  const { setLoading } = useLoader();

  useEffect(() => {
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

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const loadRecent = () => {
    try {
      const r = JSON.parse(localStorage.getItem("recentProducts") || "[]");
      setRecent(r);
    } catch {
      setRecent([]);
    }
  };

  const newArrivals = products.slice(0, 6);
  const trending = products.slice(6, 12);
  const suggested = products.slice(12, 20);

  return (
    <div className="home">
      {/* HIDDEN SEO */}
      <h1 style={{ position: "absolute", left: "-9999px" }}>
        Laptop Accessories and Spare Parts Online Store in India
      </h1>

      <p style={{ position: "absolute", left: "-9999px" }}>
        Buy laptop keyboard, battery, screen, fan, speaker, adapter and all spare
        parts for HP, Dell, Lenovo, Asus, Acer laptops in India.
      </p>

      {/* SLIDER */}
      <HomeSlider />

      {/* 🔥 NEW HARD-CODED SEO BANNER */}
      <section className="lp-banner">
        <div className="lp-banner-overlay">
          <h2>All Laptop Accessories & Spare Parts Available</h2>
          <p>
            Keyboard • Fan • Speaker • Screen • Battery • Adapter <br />
            HP • Dell • Lenovo • Asus • Acer
          </p>
          <span>Search by Model Number or Part Number</span>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <h2 className="section-title">New Arrivals</h2>
      <div className="product-grid">
        {newArrivals.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

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
