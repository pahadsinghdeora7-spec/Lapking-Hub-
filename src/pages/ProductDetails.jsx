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

      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(12);

      setRelated(rel || []);
    }
  }

  if (!product) {
    return <div style={{ padding: 20 }}>Loading product...</div>;
  }

  return (
    <div className="pd-container">

      {/* ================= IMAGE ================= */}
      <div className="pd-image-box">
        <img src={product.image} alt={product.name} />
      </div>

      {/* ================= TITLE ================= */}
      <h1 className="pd-title">{product.name}</h1>

      {/* ================= META ================= */}
      <div className="pd-meta">
        <span>🏷 Brand: <b>{product.brand || "N/A"}</b></span>
        <span>🔢 Part No: <b>{product.part_no || "N/A"}</b></span>
        <span className={product.stock > 0 ? "stock" : "out"}>
          {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
        </span>
      </div>

      {/* ================= PRICE ================= */}
      <div className="pd-price">₹{product.price}</div>

      {/* ================= QUANTITY ================= */}
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
          className="whatsapp-btn"
          href={`https://wa.me/919873670361?text=I want to order ${product.name}`}
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
          <p>{product.description || "No description available."}</p>
        )}

        {tab === "models" && (
          <p>{product.compatible_models || "Not specified."}</p>
        )}
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
