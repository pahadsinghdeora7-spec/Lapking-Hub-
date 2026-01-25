import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import { supabase } from "../supabaseClient";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setProduct(data);
    }
  };

  if (!product) {
    return <div style={{ padding: 20 }}>Loading...</div>;
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
          Brand: {product.brand}
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

        {/* COMPATIBLE MODEL */}
        {product.compatible_model && (
          <div className="product-compatible">
            <strong>Compatible Models:</strong><br />
            {product.compatible_model}
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

        {/* QUANTITY */}
        {product.stock > 0 && (
          <div className="quantity-box">
            <button onClick={() => qty > 1 && setQty(qty - 1)}>−</button>
            <span>{qty}</span>
            <button
              onClick={() =>
                qty < product.stock && setQty(qty + 1)
              }
            >
              +
            </button>
          </div>
        )}

        {/* PRICE */}
        <div className="product-price">₹{product.price}</div>

        {/* BUTTONS */}
        <button className="buy-btn">Buy Now</button>

        <button className="cart-btn">Add to Cart</button>

        <a
          className="whatsapp-btn"
          target="_blank"
          rel="noreferrer"
          href={`https://wa.me/919873670361?text=Order:%0A${product.name}%0APart No: ${product.part_number}%0AQty: ${qty}%0APrice: ₹${product.price}`}
        >
          Order on WhatsApp
        </a>

        {/* DESCRIPTION */}
        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description || "No description available."}</p>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
