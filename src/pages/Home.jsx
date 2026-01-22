import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", true)
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="page home-page">
      {/* Banner */}
      <section className="banner">
        <h2>Premium Laptop Accessories</h2>
        <p>
          Shop the best chargers, batteries, keyboards and more.
        </p>
        <button className="primary-btn">Shop Now →</button>
      </section>

      {/* Latest Products */}
      <h3 className="section-title">Latest Products</h3>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products yet. rajveer Please add from Admin Panel.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              {/* IMAGE */}
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image placeholder">
                  No image
                </div>
              )}

              {/* BODY */}
              <div className="product-body">
                <span className="product-brand">
                  Category ID: {p.category_id}
                </span>

                <h4 className="product-name">{p.name}</h4>

                <div className="product-price-row">
                  <span className="product-price">
                    ₹{p.price || 0}
                  </span>

                  <button className="small-primary-btn">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
