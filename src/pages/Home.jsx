import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./home.css";
import { useNavigate } from "react-router-dom";

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
      .order("id", { ascending: false })
      .limit(6);

    if (!error) {
      setProducts(data || []);
    }
  };

  return (
    <div className="home">
      <h2>Latest Products</h2>

      <div className="product-grid">
        {products.map(p => (
          <div
            key={p.id}
            className="product-card"
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>

            {p.compatible_model && (
              <p>Compatible: {p.compatible_model}</p>
            )}

            <strong>₹{p.price}</strong>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
