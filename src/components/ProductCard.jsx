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

        <div className="part-box">
  <div className="part-text">
    Part No: {product.part_number}
  </div>

  <div
    className={
      product.stock > 0 ? "stock in-stock" : "stock out-stock"
    }
  >
    {product.stock > 0 ? "In Stock" : "Out of Stock"}
  </div>
</div>
  </span>

  <span className="part-text">
    Part No: {product.part_number}
  </span>
</div>

        <button className="add-cart-btn">
          Add to Cart
        </button>

      </div>
    </div>
  );
}
