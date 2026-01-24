import "./product-card.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}
      <img
        src={product.image || "https://picsum.photos/300/200"}
        alt={product.name}
        className="product-image"
      />

      {/* PRODUCT NAME */}
      <h3 className="product-name">{product.name}</h3>

      {/* BRAND - CATEGORY - PART NUMBER */}
      <div className="info-row">

        {/* LEFT : BRAND */}
        <div className="brand-text">
          Brand: {product.brand || "-"}
        </div>

        {/* CENTER : CATEGORY VALUE ONLY */}
        <div className="category-text">
          {product.category_name}
        </div>

        {/* RIGHT : PART NUMBER */}
        <div className="part-text">
          Part No: {product.part_number || "-"}
        </div>

      </div>

      {/* STOCK STATUS */}
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

      {/* ADD TO CART */}
      <button
        className="add-to-cart-btn"
        disabled={product.stock <= 0}
      >
        Add to Cart
      </button>

    </div>
  );
}
