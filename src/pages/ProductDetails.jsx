import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import { supabase } from "../supabaseClient";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

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
          <div>
            <strong>Compatible Models:</strong>
            <div>{product.compatible_model || "—"}</div>
          </div>

          <div className={product.stock > 0 ? "stock-in" : "stock-out"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* PRICE */}
        <div className="product-price">₹{product.price}</div>

        {/* BUTTONS */}
        <div className="action-row">
          <button className="btn-whatsapp">Order on WhatsApp</button>
          <button className="btn-cart">Add to Cart</button>
        </div>

        <button className="btn-buy">Buy Now</button>

        {/* ================== TABS ================== */}
        <div className="tabs-box">

          <div className="tabs-header">
            <button
              className={activeTab === "description" ? "tab active" : "tab"}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>

            <button
              className={activeTab === "compatible" ? "tab active" : "tab"}
              onClick={() => setActiveTab("compatible")}
            >
              Compatible Models
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === "description" && (
              <p>{product.description || "No description available."}</p>
            )}

            {activeTab === "compatible" && (
              <p>{product.compatible_model || "No compatible models available."}</p>
            )}
          </div>

        </div>
        {/* ================== TABS END ================== */}

      </div>
    </div>
  );
};

export default ProductDetails;
