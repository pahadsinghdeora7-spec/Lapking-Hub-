import React from "react";
import { useNavigate } from "react-router-dom";
import "./product-card.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // 🔹 ONLY NEW CODE (click logic)
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* IMAGE */}
      <img
        src={product.image || "/no-image.png"}
        alt={product.name}
        className="product-image"
      />

      {/* NAME */}
      <h3 className="product-name">{product.name}</h3>

      {/* BRAND | CATEGORY | PART (LOCKED) */}
      <div className="brand-part-row">
        <span className="brand-text">
          Brand: {product.brand || "-"}
        </span>

        {/* 🔒 CATEGORY — DO NOT CHANGE */}
        {product.category_slug && (
          <div className="product-category">
            {product.category_slug.replace(/-/g, " ").toUpperCase()}
          </div>
        )}

        <span className="part-text">
          Part No: {product.part_number || "-"}
        </span>
      </div>

      {/* STOCK — PART NUMBER KE NICHE */}
      <div
        className={
          product.stock > 0 ? "stock-in" : "stock-out"
        }
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </div>

      {/* PRICE */}
      <div className="price">
        ₹{product.price || 0}
      </div>

      {/* BUTTON */}
      <button
        className="add-to-cart-btn"
        disabled={product.stock <= 0}
        onClick={(e) => e.stopPropagation()}  // ✅ button click safe
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
