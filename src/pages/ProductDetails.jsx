import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { updateCartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [preview, setPreview] = useState(false);

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

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const exist = cart.find((i) => i.id === product.id);

    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  };

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="pd-page">

      {/* IMAGE */}
      <div className="pd-image-box" onClick={() => setPreview(true)}>
        <img src={product.image} alt={product.name} />
      </div>

      {/* FULL IMAGE PREVIEW */}
      {preview && (
        <div className="pd-preview" onClick={() => setPreview(false)}>
          <img src={product.image} alt="preview" />
        </div>
      )}

      {/* TITLE */}
      <h2 className="pd-title">{product.name}</h2>

      {/* META */}
      <div className="pd-meta">
        <span>🏷 Brand: {product.brand || "N/A"}</span>
        <span>🔢 Part No: {product.part_number || "N/A"}</span>
        <span className="stock">
          {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
        </span>
      </div>

      {/* PRICE */}
      <h3 className="pd-price">₹{product.price}</h3>

      {/* QTY */}
      <div className="pd-qty">
        <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
        <input
          value={qty}
          onChange={(e) => setQty(Number(e.target.value) || 1)}
        />
        <button onClick={() => setQty(qty + 1)}>+</button>
      </div>

      {/* BUTTONS */}
      <div className="pd-btns">
        <a
          className="whatsapp-btn"
          href={`https://wa.me/919873670361?text=I want ${product.name}`}
          target="_blank"
          rel="noreferrer"
        >
          💬 Order on WhatsApp
        </a>

        <button className="cart-btn" onClick={addToCart}>
          🛒 Add to Cart
        </button>
      </div>

      <button className="buy-btn">⚡ Buy Now</button>

      {/* TABS */}
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
          <p>{product.compatible_model || "Not specified."}</p>
        )}
      </div>

      {/* RELATED */}
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
