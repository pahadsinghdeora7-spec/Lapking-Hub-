import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState("");
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  async function loadProduct() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setProduct(data);
      setActiveImg(data.image);

      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", data.category_slug)
        .neq("id", data.id)
        .limit(12);

      setRelated(rel || []);
    }
  }

  if (!product) return <div className="pd-loading">Loading product...</div>;

  const images = [
    product.image,
    product.image1,
    product.image2
  ].filter(Boolean);

  return (
    <div className="pd-container">

      {/* ================= IMAGE SECTION ================= */}
      <div className="pd-image-section">

        <img
          src={activeImg}
          className="pd-main-image"
          alt={product.name}
        />

        <div className="pd-thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImg(img)}
              className={activeImg === img ? "active" : ""}
              alt=""
            />
          ))}
        </div>

      </div>

      {/* ================= INFO ================= */}
      <div className="pd-info">

        <h1 className="pd-title">{product.name}</h1>

        <div className="pd-meta">
          <span>🏷 <b>Brand:</b> {product.brand || "-"}</span>
          <span>🔢 <b>Part No:</b> {product.part_number || "-"}</span>
          <span className={product.stock > 0 ? "stock" : "out"}>
            {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
          </span>
        </div>

        <div className="pd-price">₹{product.price}</div>

        {/* ================= QTY ================= */}
        <div className="pd-qty">
          <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
          <input
            value={qty}
            type="number"
            min="1"
            onChange={(e) => setQty(Number(e.target.value) || 1)}
          />
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="pd-actions">
          <a
            className="whatsapp-btn"
            href={`https://wa.me/919873670361?text=I want ${product.name}`}
            target="_blank"
          >
            💬 Order on WhatsApp
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

        <div className="pd-tab-content">
          {tab === "description" && (
            <p>{product.description || "No description added."}</p>
          )}

          {tab === "models" && (
            <p>{product.compatible_model || "Not specified."}</p>
          )}
        </div>

      </div>

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <>
          <h3 className="related-title">More Products</h3>
          <div className="related-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
