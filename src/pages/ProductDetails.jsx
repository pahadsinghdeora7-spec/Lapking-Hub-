import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { supabase } from "../supabaseClient";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  // ✅ EXISTING
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  // ✅ ADDED ONLY
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // ✅ AUTO IMAGE SLIDE (ADDED)
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    setProduct(data);

    // ✅ EXISTING IMAGE LOGIC
    const imgs = [];
    if (data.image) imgs.push(data.image);
    if (data.image1) imgs.push(data.image1);
    if (data.image2) imgs.push(data.image2);
    setImages(imgs);

    if (data?.category_slug) {
      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", data.category_slug)
        .neq("id", id)
        .limit(10);

      setRelated(rel || []);
    }
  };

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="product-details-page">
      <div className="product-box">

        {/* PRODUCT IMAGE */}
        {images.length > 0 && (
          <div className="pd-image-box">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="pd-image"
              onError={(e) => {
                e.target.src = "/no-image.png";
              }}
            />

            {/* DOTS (OLD SAFE) */}
            {images.length > 1 && (
              <div className="image-dots">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={activeImage === i ? "dot active" : "dot"}
                    onClick={() => setActiveImage(i)}
                  />
                ))}
              </div>
            )}

            {/* ✅ THUMBNAILS (ADDED) */}
            {images.length > 1 && (
              <div className="thumb-row">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={
                      activeImage === i ? "thumb active" : "thumb"
                    }
                    onClick={() => setActiveImage(i)}
                    alt=""
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TITLE */}
        <h2 className="pd-title">{product.name}</h2>

        {/* ROW 1 */}
        <div className="pd-row triple">
          <span>Brand: {product.brand}</span>
          <span className="center">
            {product.category_slug?.replace("-", " ").toUpperCase()}
          </span>
          <span>Part No: {product.part_number}</span>
        </div>

        {/* ROW 2 */}
        <div className="pd-row double">
          <div></div>
          <div className={product.stock > 0 ? "stock-in" : "stock-out"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* PRICE */}
        <div className="pd-price">₹{product.price}</div>

        {/* ✅ QUANTITY (ADDED) */}
        <div className="qty-box">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        {/* BUTTONS */}
        <div className="pd-buttons">
          <button
            className="whatsapp"
            onClick={() =>
              window.open(
                `https://wa.me/919873670361?text=${encodeURIComponent(
                  `Hello, I want to order ${product.name} (₹${product.price}) Qty: ${quantity}`
                )}`,
                "_blank"
              )
            }
          >
            Order on WhatsApp
          </button>

          {/* ✅ ADD TO CART WORKING */}
          <button
            className="cart"
            onClick={() => {
              const cart = JSON.parse(localStorage.getItem("cart")) || [];
              const exist = cart.find(i => i.id === product.id);

              if (exist) {
                exist.qty += quantity;
              } else {
                cart.push({ ...product, qty: quantity });
              }

              localStorage.setItem("cart", JSON.stringify(cart));
              window.dispatchEvent(new Event("cartUpdated"));
              alert("Added to cart");
            }}
          >
            Add to Cart
          </button>
        </div>

        <button
          className="buy-now"
          onClick={() =>
            window.open(
              `https://wa.me/919873670361?text=${encodeURIComponent(
                `Buy Now: ${product.name} Qty: ${quantity}`
              )}`,
              "_blank"
            )
          }
        >
          Buy Now
        </button>

        {/* TABS */}
        <div className="tabs">
          <button
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>

          <button
            className={activeTab === "models" ? "active" : ""}
            onClick={() => setActiveTab("models")}
          >
            Compatible Models
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">
          {activeTab === "description" && (
            <p>{product.description || "No description available."}</p>
          )}

          {activeTab === "models" && (
            <p>{product.compatible_model || "No models available."}</p>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="related-section">
        <h3>More Products</h3>

        <div className="related-list">
          {related.map((item) => (
            <div
              key={item.id}
              className="related-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />
              <div className="rp-name">{item.name}</div>
              <div className="rp-price">₹{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
