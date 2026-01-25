import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import { supabase } from "../supabaseClient";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);

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

        {/* PRODUCT NAME */}
        <h2 className="product-title">{product.name}</h2>

        {/* BRAND | CATEGORY | PART NUMBER */}
        <div className="triple-row">
          <span>Brand: {product.brand}</span>

          {product.category_slug && (
            <span className="center">
              {product.category_slug.replace("-", " ").toUpperCase()}
            </span>
          )}

          <span>Part No: {product.part_number}</span>
        </div>

        {/* COMPATIBLE MODEL + STOCK */}
        <div className="double-row">
          <div>
            {product.compatible_model && (
              <div className="product-compatible">
                <strong>Compatible Models:</strong>
                <div>{product.compatible_model}</div>
              </div>
            )}
          </div>

          <div
            className={
              product.stock > 0 ? "stock-in" : "stock-out"
            }
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* PRICE */}
        <div className="product-price">₹{product.price}</div>

        {/* BUTTON ROW */}
        <div className="button-row">
          <button className="whatsapp-btn">
            Order on WhatsApp
          </button>

          <button className="cart-btn">
            Add to Cart
          </button>
        </div>

        {/* BUY NOW */}
        <button className="buy-btn">
          Buy Now
        </button>

        {/* DESCRIPTION */}
        <div className="description-box">
          <h3>Description</h3>

          <p className={showMore ? "show" : "hide"}>
            {product.description || "No description available."}
          </p>

          {product.description && product.description.length > 120 && (
            <span
              className="show-more"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </span>
          )}
        </div>

      </div>

      {/* RELATED PRODUCTS (VERTICAL SCROLL READY) */}
      <div className="related-products">
        <h3>More Products</h3>
        {/* yaha baad me related products map honge */}
      </div>

    </div>
  );
};

export default ProductDetails;
