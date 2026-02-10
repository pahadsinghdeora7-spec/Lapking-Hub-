import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import HomeSlider from "../components/HomeSlider";
import { useLoader } from "../context/LoaderContext";
import { Link } from "react-router-dom";
import "./home.css";

/* ===== LOCKED CONFIG ===== */
const FIRST_LOAD = 20;
const LOAD_MORE = 10;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [recent, setRecent] = useState([]);

  const { setLoading } = useLoader();

  useEffect(() => {
    /* ===== SEO (LOCKED) ===== */
    document.title =
      "Professional Supplier Of Laptop Spare Parts & Accessories Keyboard, Fan, Speaker, Body Parts, Battery, Screen Online in India | LapkingHub";

    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }

    metaDesc.content =
      "LapkingHub is a trusted wholesale supplier of laptop replacement spare parts in India. Buy laptop replacement keyboard, body parts, battery, speaker, DC jack, fan and accessories for HP, Dell, Lenovo, Acer & Asus at best price.";

    loadInitial();
    loadRecent();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= INITIAL LOAD (20 PRODUCTS) ================= */
  const loadInitial = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, FIRST_LOAD - 1);

    if (data) {
      setProducts(data);
      setOffset(FIRST_LOAD);
      if (data.length < FIRST_LOAD) setHasMore(false);
    }

    setLoading(false);
  };

  /* ================= LOAD MORE (10 PRODUCTS) ================= */
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const from = offset;
    const to = offset + LOAD_MORE - 1;

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data) {
      setProducts((prev) => [...prev, ...data]);
      setOffset(offset + LOAD_MORE);
      if (data.length < LOAD_MORE) setHasMore(false);
    }

    setLoadingMore(false);
  };

  /* ================= SCROLL HANDLER ================= */
  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;
    if (scrollPosition >= threshold) loadMore();
  };

  /* ================= RECENT ================= */
  const loadRecent = () => {
    try {
      const r = JSON.parse(localStorage.getItem("recentProducts") || "[]");
      setRecent(r);
    } catch {
      setRecent([]);
    }
  };

  return (
    <div className="home">
      {/* ===== SEO H1 (hidden) ===== */}
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        Laptop Spare Parts & Accessories Online Dealer in India
      </h1>

      {/* ===== SLIDER ===== */}
      <HomeSlider />

      {/* ===== CATEGORY LINKS (SEO ONLY – USER HIDDEN) ===== */}
      <section
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <h2>Laptop Replacement Spare Parts Categories</h2>

        <Link to="/category/laptop-replacement-keyboard">
          Laptop Replacement Keyboard
        </Link>
        <Link to="/category/laptop-replacement-body">
          Laptop Replacement Body Parts
        </Link>
        <Link to="/category/laptop-replacement-speaker">
          Laptop Replacement Speaker
        </Link>
        <Link to="/category/laptop-replacement-battery">
          Laptop Replacement Battery
        </Link>
        <Link to="/category/laptop-replacement-dc-jack">
          Laptop Replacement DC Jack
        </Link>
        <Link to="/category/laptop-replacement-fan">
          Laptop Replacement Fan
        </Link>
        <Link to="/categories">All Laptop Spare Parts Categories</Link>
      </section>

      {/* ===== PRODUCTS ===== */}
      <h2 className="section-title">Latest Laptop Spare Parts</h2>
      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {/* ===== LOADERS ===== */}
      {loadingMore && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading more products…
        </div>
      )}

      {!hasMore && (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          You have reached the end
        </div>
      )}

      {/* ===== RECENTLY VIEWED ===== */}
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
    </div>
  );
}
