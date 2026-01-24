import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    // MAIN PRODUCT
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setProduct(data);

    // RELATED PRODUCTS (same category)
    const { data: relatedData } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", data.category_id)
      .neq("id", data.id)
      .limit(6);

    setRelated(relatedData || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (!product) {
    return <div className="page-loading">Product not found</div>;
  }

  return (
    <div className="product-details">

      {/* IMAGE */}
      <div className="pd-image">
        <img
          src={product.image || product.image1 || product.image2}
          alt={product.name}
        />
      </div>

      {/* INFO */}
      <div className="pd-info">
        <h1>{product.name}</h1>

        <p className="pd-price">₹{product.price}</p>

        {product.compatible_model && (
          <p className="pd-compatible">
            <strong>Compatible:</strong> {product.compatible_model}
          </p>
        )}

        {product.description && (
          <p className="pd-desc">{product.description}</p>
        )}

        <button
          className="pd-cart"
          onClick={() => navigate("/cart")}
        >
          Add to Cart
        </button>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="related-section">
          <h2>Related Products</h2>

          <div className="related-grid">
            {related.map((item) => (
              <div
                key={item.id}
                className="related-card"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={item.image || item.image1}
                  alt={item.name}
                />
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
