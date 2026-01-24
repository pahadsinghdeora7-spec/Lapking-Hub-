import "./product-card.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}
      <img
        src={product.image || "https://picsum.photos/300"}
        alt={product.name}
        className="product-image"
      />

      {/* PRODUCT NAME */}
      <h3 className="product-name">
        {product.name}
      </h3>

      {/* BRAND + PART NUMBER ROW */}
      <div className="brand-part-row">

        {/* BRAND */}
        <span className="brand-text">
          Brand: {product.brand || "-"}
        </span>

        {/* PART NUMBER */}
        <span className="part-text">
          Part No: {product.part_number || "-"}
        </span>

      </div>

      {/* PRICE */}
      <div className="price">
        ₹{product.price || 0}
      </div>

      {/* STOCK STATUS */}
      <div
        className={
          product.stock > 0 ? "stock-in" : "stock-out"
        }
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </div>

      {/* ADD TO CART BUTTON */}
      <button
        className="add-to-cart-btn"
        disabled={product.stock <= 0}
      >
        Add to Cart
      </button>

    </div>
  );
}
