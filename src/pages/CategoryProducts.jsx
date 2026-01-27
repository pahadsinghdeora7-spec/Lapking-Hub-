import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, [slug]);

  // ================= CATEGORY SEO =================
  const fetchCategory = async () => {
    const { data } = await supabase
      .from("categories")
      .select("h1, description, name")
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

  // ================= ADD TO CART =================
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

    // ✅ cart count update everywhere
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="cat-page">

      {/* ================= SEO ================= */}
      <Helmet>
        <title>{category?.name || slug} | Lapking Hub</title>
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

              <img src={p.image} alt={p.name} />

              <h3>{p.name}</h3>

              {/* BRAND RIGHT SIDE */}
              <div className="cat-meta">
                <span>Brand: <b>{p.brand || "-"}</b></span>
              </div>

              {/* PART NUMBER RIGHT BOTTOM */}
              <div className="cat-part">
                Part No: {p.part_no || "-"}
              </div>

              <p className="cat-price">₹{p.price}</p>

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
