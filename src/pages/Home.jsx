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
    const r = JSON.parse(localStorage.getItem("recentProducts") || "[]");
    setRecent(r);
  };

  const newArrivals = products.slice(0, 6);
  const trending = products.slice(6, 12);
  const suggested = products.slice(12, 20);

  return (
    <div className="home">

      {/* NEW ARRIVALS */}
      <Section title="New Arrivals">
        <ProductRow items={newArrivals} />
      </Section>

      {/* RECENTLY VIEWED */}
      {recent.length > 0 && (
        <Section title="Recently Viewed">
          <ProductRow items={recent} />
        </Section>
      )}

      {/* RELATED */}
      {relatedProducts?.length > 0 && (
  <>
    <h2>Related Products</h2>
    <ProductGrid products={relatedProducts} />
   </Section>
)}
      

      {/* TRENDING */}
      <Section title="Trending Products">
        <ProductRow items={trending} />
      </Section>

      {/* SUGGESTIONS */}
      <Section title="Suggestions For You">
        <ProductRow items={suggested} />
      </Section>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function ProductRow({ items }) {
  return (
    <div className="row-scroll">
      {items.map(p => (
        <Link to={`/product/${p.id}`} className="card" key={p.id}>
          <img src={p.image} />
          <div className="name">{p.name}</div>
          <div className="price">₹{p.price}</div>
        </Link>
      ))}
    </div>
  );
}
