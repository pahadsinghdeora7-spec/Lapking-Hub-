import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", true)
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="home">

      {/* BANNER */}
      <div className="banner">
        <h2>Premium Laptop Accessories</h2>
        <p>
          Shop the best chargers, batteries, keyboards and more for all laptop brands
        </p>
        <button>Shop Now</button>
      </div>

      <h3 className="section-title">Latest Products</h3>

      <div className="product-grid">
        {products.length === 0 && (
          <p style={{ padding: 20 }}>No products found</p>
        )}

        {products.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
      }
