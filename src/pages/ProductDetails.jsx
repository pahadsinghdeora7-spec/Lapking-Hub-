import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/ProductDetails.css";
import products from "../data/dummyProducts";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find(p => String(p.id) === String(id));
    setProduct(found);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  return (
    <div className="product-details-page">

      <div className="product-details-container">

        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.name}
          className="product-main-image"
        />

        {/* NAME */}
        <h2 className="product-title">{product.name}</h2>

        {/* BRAND */}
        <div className="product-row">
          <span>Brand: {product.brand}</span>
        </div>

        {/* CATEGORY */}
        {product.category_slug && (
          <div className="product-category">
            {product.category_slug.replace("-", " ").toUpperCase()}
          </div>
        )}

        {/* PART NUMBER */}
        <div className="product-row">
          Part No: {product.part_number}
        </div>
        
         {/* COMPATIBLE MODELS */}
{product.compatible_models && (
  <div className="product-compatible">
    <strong>Compatible Models:</strong><br />
    {product.compatible_models}
  </div>
)}
        {/* STOCK */}
        <div
          className={
            product.stock > 0 ? "stock-in" : "stock-out"
          }
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>

        {/* PRICE */}
        <div className="product-price">₹{product.price}</div>

        {/* ACTION BUTTONS */}
        <div className="product-actions">
          <button className="buy-now-btn">Buy Now</button>
          <button className="add-cart-btn">Add to Cart</button>
          <button className="whatsapp-btn">Order on WhatsApp</button>
        </div>

        {/* DESCRIPTION */}
        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description || "No description available."}</p>
        </div>

        {/* MORE PRODUCTS */}
        <div className="more-products">
          <h3>More Products</h3>

          <div className="related-grid">
            {products
              .filter(p => p.id !== product.id)
              .slice(0, 6)
              .map(item => (
                <div
                  key={item.id}
                  className="related-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="related-name">{item.name}</div>
                  <div className="related-price">₹{item.price}</div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
