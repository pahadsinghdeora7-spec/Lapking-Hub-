import "./product-card.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">

      {/* IMAGE */}
      <img
        src={product.image || "https://picsum.photos/300/200"}
        alt={product.name}
        className="product-image"
      />

      {/* PRODUCT NAME */}
      <h3 className="product-name">{product.name}</h3>

      {/* BRAND | CATEGORY | PART + STOCK */}
      <div className="info-row">

        {/* LEFT — BRAND */}
        <div className="brand-text">
          Brand: {product.brand || "-"}
        </div>

        {/* CENTER — CATEGORY */}
        <div className="category-text">
          {product.category_name}
        </div>

        {/* RIGHT — PART + STOCK */}
        <div className="part-box">

          <div className="part-text">
            Part No: {product.part_number || "-"}
          </div>

          <div
            className={
              product.stock > 0 ? "stock-in" : "stock-out"
            }
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>

        </div>
      </div>

      {/* PRICE */}
      <div className="price">₹{product.price || 0}</div>

      {/* BUTTON */}
      <button
        className="add-to-cart-btn"
        disabled={product.stock <= 0}
      >
        Add to Cart
      </button>

    </div>
  );
}
