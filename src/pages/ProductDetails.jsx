import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setProduct(data);
      setActiveImage(data.image);

      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", data.category_slug)
        .neq("id", data.id)
        .limit(12);

      setRelated(rel || []);
    }
  }

  if (!product) return <div className="pd-loading">Loading...</div>;

  const images = [
    product.image,
    product.image1,
    product.image2,
  ].filter(Boolean);

  return (
    <div className="pd-container">

      {/* ================= IMAGE SECTION ================= */}
      <div className="pd-image-box">
        <img src={activeImage} alt={product.name} className="pd-main-img" />

        {images.length > 1 && (
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(img)}
                className={activeImage === img ? "active" : ""}
                alt="thumb"
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= PRODUCT INFO ================= */}
      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-meta">
        <span> Brand: <b>{product.brand || "N/A"}</b></span>
        <span> Part No: <b>{product.part_number || "N/A"}</b></span>
        <span className={product.stock > 0 ? "in" : "out"}>
          {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
        </span>
      </div>

      <div className="pd-price">₹{product.price}</div>

      {/* ================= QTY ================= */}
      <div className="pd-qty">
        <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
        <input
          type="number"
          value={qty}
          min="1"
          onChange={(e) => setQty(Number(e.target.value) || 1)}
        />
        <button onClick={() => setQty(qty + 1)}>+</button>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="pd-buttons">
        <a
          href={`https://wa.me/919873670361?text=I want ${product.name} (Qty: ${qty})`}
          target="_blank"
          className="wa-btn"
        >
           Order on WhatsApp
        </a>

        <button className="cart-btn">🛒 Add to Cart</button>
      </div>

      <button className="buy-btn">⚡ Buy Now</button>

      {/* ================= TABS ================= */}
      <div className="pd-tabs">
        <button
          className={tab === "description" ? "active" : ""}
          onClick={() => setTab("description")}
        >
          📄 Description
        </button>

        <button
          className={tab === "models" ? "active" : ""}
          onClick={() => setTab("models")}
        >
          💻 Compatible Models
        </button>
      </div>

      <div className="pd-content">
        {tab === "description" && (
          <p>{product.description || "No description available."}</p>
        )}

        {tab === "models" && (
          <p>{product.compatible_model || "Not specified."}</p>
        )}
      </div>

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <>
          <h3 className="pd-related-title">More Products</h3>

          <div className="pd-related-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
