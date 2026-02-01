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

  const fetchCategory = async () => {
    const { data } = await supabase
      .from("categories")
      .select("name, h1, description")
      .eq("slug", slug)
      .single();

    setCategory(data);
  };

  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug);

    setProducts(data || []);
    setLoading(false);
  };

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
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="cat-page">

      <Helmet>
        <title>
          Buy {category?.name || slug} Online | Best Price | LapkingHub
        </title>
        <meta
          name="description"
          content={
            category?.description ||
            "Buy genuine laptop accessories online at best price."
          }
        />
      </Helmet>

      <h1 className="cat-h1">
        {category?.h1 || category?.name}
      </h1>

      {category?.description && (
        <p className="cat-desc">{category.description}</p>
      )}

      <p className="cat-trust">
        ✔ Genuine Products | ✔ Tested Quality | ✔ Easy Replacement
      </p>

      {loading ? (
        <div className="cat-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="cat-empty">No products found</div>
      ) : (
        <div className="cat-grid">
          {products.map((product) => (
            <div
              className="cat-card"
              key={product.id}
              ✅
              onClick={() => navigate(`/product/${product.slug}`)}
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
    </div>
  );
}
