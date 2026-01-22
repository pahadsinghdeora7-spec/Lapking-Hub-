import "./product-card.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">

      <img src={product.image} alt={product.name} />

      <h4>{product.name}</h4>

      <p className="price">₹{product.price}</p>

      <button>Add to Cart</button>

    </div>
  );
}
