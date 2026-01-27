import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartIds, setCartIds] = useState([]);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
    loadCart();
  }, [slug]);

  // ================= CATEGORY SEO =================
  const fetchCategory = async () => {
    const { data } = await supabase
      .from("categories")
      .select("name, h1, description")
      .eq("slug", slug)
      .single();

    setCategory(data);
  };

  // ================= PRODUCTS =================
  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug);

    setProducts(data || []);
    setLoading(false);
  };

  // ================= CART =================
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartIds(cart.map(i => i.id));
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find(i => i.id === product.id);
    if (!exists) {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setCartIds(cart.map(i => i.id));
  };

  return (
    <div className="cat-page">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          {category?.name || slug} | Lapking Hub
        </title>
        <meta
          name="description"
          content={category?.description || ""}
        />
      </Helmet>

      {/* ================= H1 ================= */}
      <h1 className="cat-h1">
        {category?.h1 || category?.name}
      </h1>

      {/* ================= DESCRIPTION ================= */}
      {category?.description && (
        <p className="cat-desc">{category.description}</p>
      )}

      {/* ================= PRODUCTS ================= */}
      {loading ? (
        <div className="cat-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="cat-empty">No products found</div>
      ) : (
        <div className="cat-grid">
          {products.map((p) => (
            <div
              className="cat-card"
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <img src={p.image} alt={p.name} />

              <div className="cat-body">
                <h3>{p.name}</h3>

                {/* BRAND + PART NO */}
                <div className="cat-meta">
                  <span>Brand: {p.brand || "-"}</span>
                  <span>Part No: {p.part_no || "-"}</span>
                </div>

                <div className="cat-price">₹{p.price}</div>

                {/* ADD TO CART */}
                <button
                  className={
                    cartIds.includes(p.id)
                      ? "cat-btn added"
                      : "cat-btn"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                >
                  {cartIds.includes(p.id)
                    ? "Added ✓"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
                  }
