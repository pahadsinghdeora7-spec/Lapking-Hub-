import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { slug } = useParams(); // ✅ SLUG
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState("");
  const [tab, setTab] = useState("description");

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  async function loadProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      setProduct(null);
      return;
    }

    setProduct(data);
    setActiveImg(data.image);

    // ================= SEO =================
    document.title = `${data.name} | Buy Online at Best Price | LapkingHub`;

    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }

    metaDesc.content = `${data.name} ${data.part_number || ""}. Buy genuine laptop accessories and spare parts online at best price from LapkingHub.`;

    // ================= RELATED =================
    const { data: rel } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", data.category_slug)
      .neq("id", data.id)
      .limit(12);

    setRelated(rel || []);
  }

  // ================= CART =================
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const exist = cart.find((i) => i.id === product.id);

    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  // ================= BUY NOW =================
  function buyNow() {
    addToCart();
    navigate("/cart");
  }

  if (!product)
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        Loading....
      </div>
    );

  const images = [
    product.image,
    product.image1,
    product.image2,
    product.image3,
  ].filter(Boolean);

  return (
    <div className="pd-container">

      {/* IMAGE */}
      <div className="pd-image-box">
        <img
          src={activeImg}
          className="pd-main-image"
          alt={product.name}
          onClick={() => window.open(activeImg, "_blank")}
        />

        <div className="pd-thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={activeImg === img ? "active" : ""}
              onClick={() => setActiveImg(img)}
            />
          ))}
        </div>
      </div>

      {/* INFO */}
      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-meta">
        <span>🏷 Brand: {product.brand || "N/A"}</span>
        <span style={{ marginLeft: 20 }}>
          🔢 Part No: {product.part_number || "N/A"}
        </span>
      </div>

      <h2 className="pd-price">₹{product.price}</h2>

      {/* QTY */}
      <div className="pd-qty-row">
        <div className="qty-box">
          <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>

          <input
            value={qty}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") return setQty("");
              if (!isNaN(v)) setQty(Number(v));
            }}
            onBlur={() => {
              if (qty === "" || qty < 1) setQty(1);
            }}
          />

          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>

        <span className="pd-stock">
          {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
        </span>
      </div>

      {/* BUTTONS */}
      <div className="pd-buttons">
        <a
          href={`https://wa.me/919873670361?text=I want ${product.name} | Part No: ${product.part_number || "N/A"} | Price: ₹${product.price}`}
          target="_blank"
          className="wa-btn"
        >
          💬 Order on WhatsApp
        </a>

        <button className="cart-btn" onClick={addToCart}>
          🛒 Add to Cart
        </button>
      </div>

      <button className="buy-btn" onClick={buyNow}>
        ⚡ Buy Now
      </button>

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

      {/* CONTENT */}
      <div className="pd-full-section">
        {tab === "description" && (
          <div
            className="pd-desc"
            dangerouslySetInnerHTML={{
              __html: product.description || "<p>No description available.</p>",
            }}
          />
        )}

        {tab === "models" && (
          <div
            className="pd-desc"
            dangerouslySetInnerHTML={{
              __html: product.compatible_model || "<p>Not specified.</p>",
            }}
          />
        )}
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <>
          <h2 className="related-title">
            Related Laptop Accessories
          </h2>

          <div className="related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
