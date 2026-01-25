import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../pages/ProductDetails.css";
import { supabase } from "../supabaseClient";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    // MAIN PRODUCT
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setProduct(data);

      // RELATED PRODUCTS (same category)
      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", data.category_slug)
        .neq("id", data.id)
        .limit(6);

      setRelated(relatedData || []);
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
        {product.brand && (
          <div className="product-row">
            Brand: {product.brand}
          </div>
        )}

        {/* CATEGORY */}
        {product.category_slug && (
          <div className="product-category">
            {product.category_slug.replace("-", " ").toUpperCase()}
          </div>
        )}

        {/* PART NUMBER */}
        {product.part_number && (
          <div className="product-row">
            Part No: {product.part_number}
          </div>
        )}

        {/* COMPATIBLE MODEL */}
        {product.compatible_model && (
          <div className="product-compatible">
            <strong>Compatible Model:</strong>
            <br />
            {product.compatible_model}
          </div>
        )}

        {/* PRICE */}
        <div className="product-price">
          ₹{product.price}
        </div>

        {/* STOCK */}
        <div className={product.stock > 0 ? "stock-in" : "stock-out"}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>

        {/* QUANTITY */}
<div className="quantity-box">
  <button
    onClick={() => qty > 1 && setQty(qty - 1)}
  >
    −
  </button>

  <span>{qty}</span>

  <button
    onClick={() =>
      qty < product.stock && setQty(qty + 1)
    }
  >
    +
  </button>
</div>

        {/* BUTTONS */}
        <div className="product-buttons">
          <button className="buy-now">Buy Now</button>
          <button className="add-cart">Add to Cart</button>

          <a
            href={`https://wa.me/919873670361?text=I want to order ${product.name} (Part No: ${product.part_number})`}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            Order on WhatsApp
          </a>
        </div>

        {/* DESCRIPTION */}
        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description || "No description available."}</p>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="related-section">
            <h3>More Products</h3>

            <div className="related-grid">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="related-card"
                  onClick={() =>
                    window.location.href = `/product/${item.id}`
                  }
                >
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
