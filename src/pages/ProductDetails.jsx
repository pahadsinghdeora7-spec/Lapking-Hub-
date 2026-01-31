import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  const [preview, setPreview] = useState(null);

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

      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", data.category_slug)
        .neq("id", data.id)
        .limit(12);

      setRelated(rel || []);
    }
  }

  /* ================= ADD TO CART ================= */
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const exist = cart.find((i) => i.id === product.id);

    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  const images = [
    product.image,
    product.image1,
    product.image2
  ].filter(Boolean);

  return (
    <div className="pd-container">

      {/* ================= IMAGE ================= */}
      <div className="pd-image-box">
        <img
          src={product.image}
          alt={product.name}
          className="pd-main-img"
          onClick={() => setPreview(product.image)}
        />
      </div>

      {/* ================= FULL IMAGE PREVIEW ================= */}
      {preview && (
        <div className="img-preview" onClick={() => setPreview(null)}>
          <img src={preview} alt="preview" />
          <span className="close">✕</span>
        </div>
      )}

      {/* ================= TITLE ================= */}
      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-meta">
        <span>Brand: <b>{product.brand}</b></span>
        <span>Part No: <b>{product.part_number || "N/A"}</b></span>
      </div>

      <div className="pd-price">₹{product.price}</div>

      {/* ================= QTY + STOCK ================= */}
      <div className="pd-qty-row">
        <div className="pd-qty">
          <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
          <input
            value={qty}
            type="number"
            onChange={(e) => setQty(Number(e.target.value) || 1)}
          />
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>

        <span className="stock">
          {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
        </span>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="pd-buttons">
        <a
          href={`https://wa.me/919873670361?text=I want ${product.name} Qty:${qty}`}
          className="wa-btn"
          target="_blank"
        >
          💬 Order on WhatsApp
        </a>

        <button className="cart-btn" onClick={addToCart}>
          🛒 Add to Cart
        </button>
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
