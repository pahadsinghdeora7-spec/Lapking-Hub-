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
    loadCategoryAndProducts();
    loadCart();
  }, [slug]);

  /* ================= CATEGORY + PRODUCTS ================= */
  const loadCategoryAndProducts = async () => {
    setLoading(true);

    // 👉 slug se category lao (ID IMPORTANT)
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id, name, h1, description")
      .eq("slug", slug)
      .single();

    if (!categoryData) {
      setCategory(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    setCategory(categoryData);

    // 👉 category_id se products lao (slug-safe)
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryData.id);

    setProducts(productData || []);
    setLoading(false);
  };

  /* ================= CART ================= */
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartIds(cart.map((i) => i.id));
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.find((i) => i.id === product.id)) {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    setCartIds(cart.map((i) => i.id));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const openProduct = (product) => {
    if (!product?.slug) return;
    navigate("/product/" + product.slug);
  };

  return (
    <div className="cat-page">
      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          {category?.name || slug} | Laptop Spare Parts Online in India | LapkingHub
        </title>

        <meta
          name="description"
          content={
            category?.description
              ? `${category.description} Buy genuine ${category.name} for HP, Dell, Lenovo, Acer & Asus laptops at best price in India. Trusted supplier – LapkingHub.`
              : `Buy ${category?.name} laptop spare parts online in India. Genuine quality, wholesale price & fast delivery from LapkingHub.`
          }
        />
      </Helmet>

      {/* ================= H1 ================= */}
      <h1 className="cat-h1">{category?.h1 || category?.name}</h1>

      {/* ================= SUB HEADING ================= */}
      <p className="cat-sub">
        {category?.name} for HP, Dell, Lenovo, Acer & Asus Laptops
      </p>

      {/* ================= INTRO ================= */}
      {category?.description && (
        <p className="cat-desc">{category.description}</p>
      )}

      <p className="cat-trust">
        ✔ Genuine Products &nbsp; | &nbsp; ✔ Tested Quality &nbsp; | &nbsp; ✔ Easy
        Replacement
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
                  {cartIds.includes(product.id) ? "Added ✓" : "Add to Cart"}
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
            laptop spare parts and accessories. All products are quality checked,
            competitively priced and shipped fast across India.
          </p>
        </div>
      )}
    </div>
  );
}
