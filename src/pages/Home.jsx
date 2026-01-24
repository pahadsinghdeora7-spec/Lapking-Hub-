import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "./home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", true)
      .order("id", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }
  };

  return (
    <div className="home">
      {/* SEARCH */}
      <input
        className="search-box"
        placeholder="Search products..."
        disabled
      />

      {/* BANNER */}
      <div className="banner">
        <h2>Premium Laptop Accessories</h2>
        <p>
          Shop the best chargers, batteries, keyboards and more for all laptop
          brands
        </p>
        <button>Shop Now</button>
      </div>

      {/* PRODUCTS */}
      <h3 className="section-title">Latest Products</h3>

      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.image || product.image1}
              alt={product.name}
            />

            <h4>{product.name}</h4>

            {/* ✅ FIXED FIELD NAME */}
            {product.compatible_model && (
              <p className="compatible">
                Compatible: {product.compatible_model}
              </p>
            )}

            <strong>₹{product.price}</strong>

            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
