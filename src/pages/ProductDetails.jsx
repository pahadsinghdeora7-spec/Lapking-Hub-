import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
      />

      <h3>{product.name}</h3>

      <p className="brand">
        Brand: {product.brand || "-"}
      </p>

      <p className="price">₹{product.price}</p>

      {product.stock > 0 ? (
        <span className="in-stock">In Stock</span>
      ) : (
        <span className="out-stock">Out of Stock</span>
      )}
    </div>
  );
}
