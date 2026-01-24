import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProduct(data);

    // related products
    const { data: rel } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", data.category_id)
      .neq("id", data.id)
      .limit(6);

    setRelated(rel || []);
  };

  if (!product) {
    return <div style={{ padding: 20 }}>Loading product...</div>;
  }

  return (
    <div className="product-details">

      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <h2>{product.name}</h2>

      {product.compatible_m && (
        <p>
          <b>Compatible:</b> {product.compatible_m}
        </p>
      )}

      <h3>₹{product.price}</h3>

      <button
        className="add-btn"
        onClick={() => navigate("/cart")}
      >
        Add to Cart
      </button>

      {related.length > 0 && (
        <>
          <h3 style={{ marginTop: 30 }}>Related Products</h3>

          <div className="related-grid">
            {related.map((p) => (
              <div
                key={p.id}
                className="related-card"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <img src={p.image} alt={p.name} />
                <p>{p.name}</p>
                <b>₹{p.price}</b>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
