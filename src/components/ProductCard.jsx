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

      {/* BRAND + CATEGORY + PART */}
<div className="brand-row">

  {/* LEFT */}
  <div className="brand-left">
    Brand: {product.brand || "-"}
  </div>

  {/* CENTER */}
  {product.category_slug && (
    <div className="brand-center">
      {product.category_slug.replace("-", " ").toUpperCase()}
    </div>
  )}

  {/* RIGHT */}
  <div className="brand-right">
    Part No: {product.part_number || "-"}
  </div>

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
