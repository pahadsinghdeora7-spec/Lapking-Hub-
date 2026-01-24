import "./product-card.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}
      <img
        src={product.image || "https://via.placeholder.com/300"}
        alt={product.name}
        className="product-image"
      />

      {/* PRODUCT NAME */}
      <h3 className="product-name">{product.name}</h3>

      {/* BRAND + PART NUMBER + STOCK */}
      <div className="brand-part-row">

        {/* LEFT — BRAND */}
        <span className="brand-text">
          Brand: {product.brand || "-"}
        </span>

        {/* RIGHT — PART NUMBER + STOCK */}
        <div className="part-stock-wrapper">

          {/* PART NUMBER */}
          <span className="part-text">
            Part No: {product.part_number || "-"}
          </span>

          {/* STOCK */}
          <span
            className={
              product.stock > 0
                ? "stock-text stock-in"
                : "stock-text stock-out"
            }
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

        </div>
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
