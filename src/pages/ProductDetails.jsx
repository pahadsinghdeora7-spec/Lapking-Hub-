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
  const [activeImg, setActiveImg] = useState("");

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
      setActiveImg(data.image);

      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(20);

      setRelated(rel || []);

      // ✅ SEO
      document.title = `${data.name} | ${data.brand} Laptop Spare Part`;
    }
  }

  if (!product) return <div className="pd-loading">Loading...</div>;

  return (
    <div className="pd-container">

      {/* ================= TOP SECTION ================= */}
      <div className="pd-top">

        {/* LEFT IMAGES */}
        <div className="pd-left">
          <img src={activeImg} className="pd-main-img" alt={product.name} />

          {product.images && (
            <div className="pd-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImg(img)}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT DETAILS */}
        <div className="pd-right">

          <h1 className="pd-title">
            {product.name} – {product.brand} Laptop Spare Part
          </h1>

          <div className="pd-stock">
            {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
          </div>

          <div className="pd-price">₹{product.price}</div>

          {/* ICON INFO */}
          <div className="pd-icons">
            <div>🧩 Original Spare</div>
            <div>💯 Quality Tested</div>
            <div>📦 Safe Packaging</div>
            <div>🔄 7 Days Replacement</div>
          </div>

          {/* QUANTITY */}
          <div className="pd-qty">
            <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
            <input
              type="number"
              value={qty}
              min="1"
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          {/* BUTTONS */}
          <div className="pd-buttons">
            <a
              href={`https://wa.me/919873670361?text=I want ${product.name} Qty ${qty}`}
              target="_blank"
              className="btn-whatsapp"
            >
              Order on WhatsApp
            </a>

            <button className="btn-cart">Add to Cart</button>
          </div>

          <button className="btn-buy">Buy Now</button>

        </div>
      </div>

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

        <button
          className={tab === "specs" ? "active" : ""}
          onClick={() => setTab("specs")}
        >
          Specifications
        </button>
      </div>

      <div className="pd-tab-content">
        {tab === "description" && (
          <p>{product.description || "No description available."}</p>
        )}

        {tab === "models" && (
          <p>{product.compatible_models || "Not specified."}</p>
        )}

        {tab === "specs" && (
          <ul>
            <li>Brand: {product.brand}</li>
            <li>Part No: {product.part_no}</li>
            <li>Condition: New</li>
            <li>Warranty: 7 Days Replacement</li>
          </ul>
        )}
      </div>

      {/* ================= RELATED ================= */}
      <h3 className="pd-related-title">More Products</h3>

      <div className="pd-related-grid">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
          }
