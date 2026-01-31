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

  const images = [
    product?.image,
    product?.image1,
    product?.image2
  ].filter(Boolean);

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="pd-page">

      {/* MAIN IMAGE */}
      <div className="pd-image-box">
        <img src={activeImage} alt={product.name} />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="pd-thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(img)}
              className={activeImage === img ? "active" : ""}
            />
          ))}
        </div>
      )}

      <h2 className="pd-title">{product.name}</h2>

      <div className="pd-meta">
        <span>🏷 Brand: {product.brand}</span>
        <span className="partno">🔢 Part No: {product.part_number}</span>
        <span className="stock">✅ In Stock</span>
      </div>

      <h3 className="pd-price">₹{product.price}</h3>

      {/* QTY FIXED */}
      <div className="pd-qty">
        <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>

        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) =>
            setQty(Math.max(1, Number(e.target.value)))
          }
        />

        <button onClick={() => setQty(q => q + 1)}>+</button>
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
          <p>{product.description}</p>
        )}

        {tab === "models" && (
          <p>{product.compatible_model}</p>
        )}
      </div>

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
