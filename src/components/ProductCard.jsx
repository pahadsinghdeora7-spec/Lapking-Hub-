// React import
import React from "react";

// CSS import
import "./product-card.css";

// ProductCard component
export default function ProductCard({ product }) {

  // stock check
  const inStock = product.stock > 0;

  return (
    // MAIN CARD
    <div className="product-card">

      {/* IMAGE */}
      <div className="product-image">
        <img
          src={product.image || "https://picsum.photos/300/300"}
          alt={product.name}
        />
      </div>

      {/* PRODUCT NAME */}
      <h3 className="product-title">
        {product.name}
      </h3>

      {/* BRAND + PART NUMBER ROW */}
      <div className="brand-row">

        {/* LEFT — BRAND */}
        <div className="brand-text">
          Brand: <span>{product.brand || "N/A"}</span>
        </div>

        {/* PART NUMBER + STOCK */}
<div className="part-stock-box">

  {/* PART NUMBER */}
  <div className="part-no">
    Part No: {product.part_number}
  </div>

  {/* STOCK STATUS */}
  <div
    className={
      product.stock > 0 ? "stock-in" : "stock-out"
    }
  >
    {product.stock > 0 ? "In Stock" : "Out of Stock"}
  </div>

</div>

        </div>
      </div>

      {/* PRICE */}
      <div className="price">
        ₹{product.price || 0}
      </div>

      {/* ADD TO CART BUTTON */}
      <button
        className="add-cart-btn"
        disabled={!inStock}
      >
        Add to Cart
      </button>

    </div>
  );
}
