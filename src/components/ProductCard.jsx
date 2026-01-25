import "./product-card.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <h3 className="product-name">{product.name}</h3>

      {/* BRAND | CATEGORY | PART */}
      <div className="info-row">

  {/* LEFT */}
  <span className="brand-text">
    Brand: {product.brand || "-"}
  </span>

  {/* CENTER CATEGORY */}
  <span className="category-text">
    {product.category || ""}
  </span>

  {/* RIGHT */}
  <div className="part-stock">
    <span className="part-text">
      Part No: {product.part_number || "-"}
    </span>

    <span
      className={
        product.stock > 0 ? "stock-in" : "stock-out"
      }
    >
      {product.stock > 0 ? "In Stock" : "Out of Stock"}
    </span>
  </div>

</div>

      <div className="price">
        ₹{product.price || 0}
      </div>

      <button
        className="add-to-cart-btn"
        disabled={product.stock <= 0}
      >
        Add to Cart
      </button>

    </div>
  );
};

export default ProductCard;
