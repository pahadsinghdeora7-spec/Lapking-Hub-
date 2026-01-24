import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", true)
      .order("id", { ascending: false })
      .limit(8);

    if (!error && data) {
      setProducts(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

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

      {/* PRODUCTS */}
      <h3 className="section-title">Latest Products</h3>

      <div className="product-grid">
        {products.map((p) => (
          <div
            key={p.id}
            className="product-card"
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <img
              src={p.image || p.image1}
              alt={p.name}
            />

            <h4>{p.name}</h4>

            {p.compatible_model && (
              <p className="compatible">
                Compatible: {p.compatible_model}
              </p>
            )}

            <p className="price">₹{p.price}</p>

            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
