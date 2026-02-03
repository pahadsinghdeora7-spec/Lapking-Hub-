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

  /* ================= CATEGORY ================= */
  const fetchCategory = async () => {
    const { data } = await supabase
      .from("categories")
      .select("name, h1, description")
      .eq("slug", slug)
      .single();

    setCategory(data);
  };

  /* ================= PRODUCTS ================= */
  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug);

    setProducts(data || []);
    setLoading(false);
  };

  /* ================= CART ================= */
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartIds(cart.map(i => i.id));
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.find(i => i.id === product.id)) {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    setCartIds(cart.map(i => i.id));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const openProduct = (product) => {
    if (!product?.slug) return;
    navigate("/product/" + product.slug);
  };

  const productCount = products.length;

  return (
    <div className="cat-page">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          Buy {category?.name || slug} Online ({productCount}+ Products) | Best Price | LapkingHub
        </title>

        <meta
          name="description"
          content={
            category?.description
              ? `${category.description} ✓ Genuine products ✓ Best price ✓ Fast delivery from LapkingHub.`
              : "Buy genuine laptop accessories online at best price from LapkingHub. Trusted quality and fast delivery."
          }
        />
      </Helmet>

      {/* ================= H1 ================= */}
      <h1 className="cat-h1">
        {category?.h1 || category?.name}
      </h1>

      {/* ================= INTRO ================= */}
      {category?.description && (
        <p className="cat-desc">{category.description}</p>
      )}

      <p className="cat-trust">
        ✔ Genuine Products &nbsp; | &nbsp;
        ✔ Tested Quality &nbsp; | &nbsp;
        ✔ Easy Replacement
      </p>

      {/* ================= PRODUCTS ================= */}
      {loading ? (
        <div className="cat-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="cat-empty">No products found</div>
      ) : (
        <div className="cat-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="cat-card"
              onClick={() => openProduct(product)}
            >
              <img src={product.image} alt={product.name} />

              <div className="cat-body">
                <h3>{product.name}</h3>

                <div className="cat-meta">
                  <span>Brand: {product.brand || "-"}</span>
                  <span>Part No: {product.part_number || "-"}</span>
                </div>

                <div className="cat-price">₹{product.price}</div>

                <button
                  className={
                    cartIds.includes(product.id)
                      ? "cat-btn added"
                      : "cat-btn"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  {cartIds.includes(product.id)
                    ? "Added ✓"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= SEO FOOTER TEXT ================= */}
      {category && products.length > 0 && (
        <div className="cat-seo-text">
          <h2>Buy {category.name} Online from LapkingHub</h2>
          <p>
            LapkingHub offers a wide range of {category.name} including genuine
            spare parts, accessories and compatible products. All items are
            quality checked, competitively priced and shipped fast across India.
          </p>
        </div>
      )}
    </div>
  );
      }
