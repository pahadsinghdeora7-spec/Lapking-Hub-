import { Link } from "react-router-dom";
import "./product-card.css";

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

        <div className="brand-part-row">
  <span className="brand-text">
    Brand: {product.brand}
  </span>

  <span className="part-text">
    Part No: {product.part_number}
  </span>
</div>

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
