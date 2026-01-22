export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <span className="brand">{product.brand}</span>

      <h4>{product.name}</h4>

      <p className="price">₹{product.price}</p>

      <button className="cart-btn">Add to Cart</button>
    </div>
  );
}
