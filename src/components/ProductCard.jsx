export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="image-box">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-body">
        <span className="brand">{product.brand}</span>

        <h4 className="name">{product.name}</h4>

        <div className="price-row">
          <span className="price">₹{product.price}</span>
          <button className="cart-btn">Add</button>
        </div>
      </div>
    </div>
  );
}
