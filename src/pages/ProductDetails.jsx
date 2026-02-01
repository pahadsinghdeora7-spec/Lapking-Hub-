import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState("");
  const [tab, setTab] = useState("description");
  const [loading, setLoading] = useState(true);

  // ================= LOAD PRODUCT BY SLUG =================
  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  async function loadProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", true)
      .single();

    if (!data || error) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(data);
    setActiveImg(data.image);
    setLoading(false);

    // ================= SEO =================
    document.title = `${data.name} (${data.part_number || ""}) | Buy Online | LapkingHub`;

    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }

    metaDesc.content = `${data.name} ${data.part_number || ""}. Buy original laptop spare parts online at best price. Compatible with Dell, HP, Lenovo and more at LapkingHub.`;

    // ================= RELATED =================
    const { data: rel } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", data.category_slug)
      .neq("slug", data.slug)
      .limit(12);

    setRelated(rel || []);
  }

  // ================= CART =================
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const exist = cart.find((i) => i.slug === product.slug);

    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }

  function buyNow() {
    addToCart();
    navigate("/cart");
  }

  // ================= LOADING =================
  if (loading) {
    return <div style={{ padding: 30 }}>Loading product...</div>;
  }

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        ❌ Product not found
      </div>
    );
  }

  const images = [
    product.image,
    product.image1,
    product.image2,
  ].filter(Boolean);

  return (
    <div className="pd-container">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>{product.name} | LapkingHub</title>
        <meta
          name="description"
          content={`${product.name} ${product.part_number || ""}. Buy genuine laptop accessories and spare parts online.`}
        />
      </Helmet>

      {/* ================= IMAGE ================= */}
      <div className="pd-image-box">
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
              alt=""
              className={activeImg === img ? "active" : ""}
              onClick={() => setActiveImg(img)}
            />
          ))}
        </div>
      </div>

      {/* ================= INFO ================= */}
      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-meta">
        <span>Brand: {product.brand || "N/A"}</span>
        <span>Part No: {product.part_number || "N/A"}</span>
      </div>

      <h2 className="pd-price">₹{product.price}</h2>

      {/* ================= QTY ================= */}
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
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="pd-buttons">
        <a
          href={`https://wa.me/919873670361?text=I want ${product.name} | Part No: ${product.part_number}`}
          target="_blank"
          className="wa-btn"
        >
          Order on WhatsApp
        </a>

        <button className="cart-btn" onClick={addToCart}>
          Add to Cart
        </button>
      </div>

      <button className="buy-btn" onClick={buyNow}>
        Buy Now
      </button>

      {/* ================= TABS ================= */}
      <div className="pd-tabs">
        <button
          className={tab === "description" ? "active" : ""}
          onClick={() => setTab("description")}
        >
          Description
        </button>

        <button
          className={tab === "models" ? "active" : ""}
          onClick={() => setTab("models")}
        >
          Compatible Models
        </button>
      </div>

      <div className="pd-full-section">
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
          <h2 className="related-title">Related Products</h2>
          <div className="related-grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
      }
