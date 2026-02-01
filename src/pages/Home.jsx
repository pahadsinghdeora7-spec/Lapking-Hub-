import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import HomeSlider from "../components/HomeSlider";
import { useLoader } from "../context/LoaderContext";
import "./home.css";

export default function Home() {
  const { setLoading } = useLoader();   // ✅ ADD
  const [products, setProducts] = useState([]);
  const [recent, setRecent] = useState([]);

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
      "Buy laptop accessories and spare parts online in India. Keyboard, charger, battery, DC jack, screen, speaker, fan and all laptop parts available at best price on LapkingHub.";

    loadProducts();
    loadRecent();
  }, []);

  // ========================
  // LOAD PRODUCTS
  // ========================
  const loadProducts = async () => {
    setLoading(true);                 // ✅ ON

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);                // ✅ OFF
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

  const newArrivals = products.slice(0, 6);
  const trending = products.slice(6, 12);
  const suggested = products.slice(12, 20);

  return (
    <div className="home">
      <HomeSlider />

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
