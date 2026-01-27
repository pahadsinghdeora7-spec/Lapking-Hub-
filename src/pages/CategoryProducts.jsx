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

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, [slug]);

  // ======================
  // CATEGORY SEO DATA
  // ======================
  const fetchCategory = async () => {
    const { data } = await supabase
      .from("categories")
      .select("name, h1, description")
      .eq("slug", slug)
      .single();

    setCategory(data);
  };

  // ======================
  // PRODUCTS BY CATEGORY
  // ======================
  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug);

    setProducts(data || []);
    setLoading(false);
  };

  // ======================
  // ADD TO CART (SAFE)
  // ======================
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find((item) => item.id === product.id);

    if (exist) {
      exist.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        part_no: product.part_no,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
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
        <div className="cat-empty">
          No products found in this category
        </div>
      ) : (
        <div className="cat-grid">
          {products.map((p) => (
            <div className="cat-card" key={p.id}>

              <img
                src={p.image || "/no-image.png"}
                alt={p.name}
              />

              {/* NAME */}
              <h3>{p.name}</h3>

              {/* BRAND RIGHT SIDE */}
              {p.brand && (
                <div className="cat-meta">
                  <span>Brand:</span>
                  <b>{p.brand}</b>
                </div>
              )}

              {/* PART NUMBER RIGHT SIDE */}
              {p.part_no && (
                <div className="cat-meta">
                  <span>Part No:</span>
                  <b>{p.part_no}</b>
                </div>
              )}

              {/* PRICE */}
              <p className="price">₹{p.price}</p>

              {/* ADD TO CART */}
              <button onClick={() => addToCart(p)}>
                Add to Cart
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
