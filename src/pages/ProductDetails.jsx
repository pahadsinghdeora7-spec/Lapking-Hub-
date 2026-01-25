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

    {/* BRAND / CATEGORY / PART */}
    <div className="triple-row">
      <span>Brand: {product.brand}</span>

      {product.category_slug && (
        <span className="center">
          {product.category_slug.replace("-", " ").toUpperCase()}
        </span>
      )}

      <span>Part No: {product.part_number}</span>
    </div>

    {/* COMPATIBLE + STOCK */}
    <div className="double-row">
      <div className="left">
        {product.compatible_model && (
          <>
            <strong>Compatible Models:</strong>
            <div>{product.compatible_model}</div>
          </>
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
    <div className="product-price">
      ₹{product.price}
    </div>

    {/* BUTTON ROW */}
    <div className="button-row">
      <button className="btn-whatsapp">
        Order on WhatsApp
      </button>

      <button className="btn-cart">
        Add to Cart
      </button>
    </div>

    {/* BUY NOW */}
    <button className="btn-buy">
      Buy Now
    </button>

    {/* DESCRIPTION */}
    <div className="product-description">
      <h4>Description</h4>

      <p className="desc-text">
        {product.description || "No description available."}
      </p>

      <span className="show-more">
        Show More
      </span>
    </div>

  </div>

  {/* RELATED PRODUCTS */}
  <div className="related-section">
    <h3>Related Products</h3>

    <div className="related-vertical">
      {/* yaha tum map laga rahe ho — wahi rehne do */}
    </div>
  </div>
</div>
