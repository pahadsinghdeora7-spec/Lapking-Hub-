import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">

      {/* IMAGE */}
      <div className="product-image">
        <img
          src={product.image || "https://picsum.photos/300"}
          alt={product.name}
        />
      </div>

      {/* DETAILS */}
      <div className="product-details">

        <h3 className="product-name">
          {product.name}
        </h3>

        {product.brand && (
          <p className="product-brand">
            Brand: {product.brand}
          </p>
        )}

        {product.part_number && (
          <p className="product-part">
            Part No: {product.part_number}
          </p>
        )}

        <div className="product-price">
          ₹{product.price}
        </div>

        {product.stock > 0 ? (
          <span className="stock in">In Stock</span>
        ) : (
          <span className="stock out">Out of Stock</span>
        )}

        <button className="add-cart-btn">
          Add to Cart
        </button>

      </div>
    </div>
  );
}
