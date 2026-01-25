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

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="product-details-page">
      <div className="product-card">

        {/* NAME */}
        <h2 className="product-name">{product.name}</h2>

        {/* BRAND | CATEGORY | PART */}
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
          <div>
            <strong>Compatible Models:</strong>
            <div>{product.compatible_model}</div>
          </div>

          <div className="stock">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* PRICE */}
        <div className="price">₹{product.price}</div>

        {/* ACTION BUTTONS */}
        <div className="action-row">
          <button className="whatsapp-btn">Order on WhatsApp</button>
          <button className="cart-btn">Add to Cart</button>
        </div>

        <button className="buy-btn">Buy Now</button>

        {/* DESCRIPTION */}
        <div className="description-box">
          <h4>Description</h4>
          <p className={showMore ? "" : "short"}>
            {product.description || "No description available."}
          </p>

          {product.description?.length > 120 && (
            <span
              className="show-more"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </span>
          )}
        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <h3 className="more-title">More Products</h3>
      <div className="related-scroll">
        {/* yaha tum future me related products map karoge */}
      </div>
    </div>
  );
};

export default ProductDetails;
