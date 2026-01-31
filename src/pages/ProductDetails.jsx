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
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(20);

      setRelated(rel || []);
    }
  }

  if (!product) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="pd-page">

      {/* ================= IMAGE ================= */}
      <img
        src={product.image}
        className="pd-image"
        alt={product.name}
      />

      {/* ================= INFO ================= */}
      <h2 className="pd-title">{product.name}</h2>

      <div className="pd-meta">
        <span><b>Brand:</b> {product.brand}</span>
        <span><b>Part No:</b> {product.part_no}</span>
        <span className="stock">
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <h3 className="pd-price">₹{product.price}</h3>

      {/* ================= BUTTONS ================= */}
      <div className="pd-btns">
        <a
          className="whatsapp-btn"
          href={`https://wa.me/919873670361?text=I want ${product.name}`}
          target="_blank"
        >
          Order on WhatsApp
        </a>

        <button className="cart-btn">Add to Cart</button>
      </div>

      <button className="buy-btn">Buy Now</button>

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

      <div className="pd-tab-content">
        {tab === "description" && (
          <p>{product.description || "No description available."}</p>
        )}

        {tab === "models" && (
          <p>{product.compatible_models || "Not specified."}</p>
        )}
      </div>

      {/* ================= RELATED ================= */}
      <h3 className="related-title">More Products</h3>

      <div className="related-grid">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
}
