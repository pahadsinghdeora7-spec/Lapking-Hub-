import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* PRODUCT IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      {/* PRODUCT NAME */}
      <h4 className="product-title">{product.name}</h4>

      {/* BRAND + CATEGORY + PART */}
      <div className="product-info-row">
        <span>Brand: {product.brand || "-"}</span>
        <span className="category-text">{product.category_name}</span>
        <span>Part No: {product.part_number || "-"}</span>
      </div>

      {/* STOCK */}
      <div
        className={
          product.stock > 0 ? "stock-in" : "stock-out"
        }
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </div>

      {/* PRICE */}
      <div className="price">₹{product.price || 0}</div>

      {/* BUTTON */}
      <button
        className="add-to-cart-btn"
        onClick={(e) => {
          e.stopPropagation(); // VERY IMPORTANT
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
