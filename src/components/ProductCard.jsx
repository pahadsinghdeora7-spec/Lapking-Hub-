import React from "react";
import { useNavigate } from "react-router-dom";
import "./product-card.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // 🔥 card open logic
  const openDetails = () => {
    navigate(`/product/${product.id}`);
  };

  // 🔥 add to cart logic
  const addToCart = (e) => {
    e.stopPropagation(); // ❌ card click stop

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex((i) => i.id === product.id);

    if (index !== -1) {
      cart[index].qty += 1;
    } else {
      cart.push({
        ...product,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔥 header + nav update
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div
      className="product-card"
      onClick={openDetails}
    >
      {/* IMAGE */}
      <img
        src={product.image || "/no-image.png"}
        alt={product.name}
        className="product-image"
      />

      {/* NAME */}
      <h3 className="product-name">{product.name}</h3>

      {/* BRAND ROW */}
      <div className="brand-row">
        <div className="brand-left">
          Brand: {product.brand || "-"}
        </div>

        {product.category_slug && (
          <div className="brand-center">
            {product.category_slug.replace("-", " ").toUpperCase()}
          </div>
        )}

        <div className="brand-right">
          Part No: {product.part_number || "-"}
        </div>
      </div>

      {/* STOCK */}
      <div className={product.stock > 0 ? "stock-in" : "stock-out"}>
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </div>

      {/* PRICE */}
      <div className="price">₹{product.price || 0}</div>

      {/* BUTTON */}
      <button
        className="add-to-cart-btn"
        disabled={product.stock <= 0}
        onClick={addToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
