import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setProduct(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">

        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.name}
          className="product-main-image"
        />

        {/* NAME */}
        <h2 className="product-title">{product.name}</h2>

        {/* BRAND */}
        {product.brand && (
          <div className="product-row">
            Brand: {product.brand}
          </div>
        )}

        {/* CATEGORY */}
        {product.category && (
          <div className="product-category">
            {product.category}
          </div>
        )}

        {/* PART NUMBER */}
        {product.part_number && (
          <div className="product-row">
            Part No: {product.part_number}
          </div>
        )}

        {/* MODEL */}
        {product.model && (
          <div className="product-compatible">
            Compatible Model: {product.model}
          </div>
        )}

        {/* PRICE */}
        <div className="product-price">₹{product.price}</div>

        {/* STOCK */}
        <div className={product.stock > 0 ? "stock-in" : "stock-out"}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
