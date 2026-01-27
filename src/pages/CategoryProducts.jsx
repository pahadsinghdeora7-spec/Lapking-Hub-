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

  // ✅ CATEGORY SEO DATA
  const fetchCategory = async () => {
    const { data } = await supabase
      .from("categories")
      .select("h1, description, name")
      .eq("slug", slug)
      .single();

    setCategory(data);
  };

  // ✅ PRODUCTS BY SLUG
  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug);

    setProducts(data || []);
    setLoading(false);
  };

  return (
    <div className="cat-page">

      {/* ✅ SEO */}
      <Helmet>
        <title>
          {category?.name || slug} | Lapking Hub
        </title>
        <meta
          name="description"
          content={category?.description || ""}
        />
      </Helmet>

      {/* ✅ FRONTEND H1 */}
      <h1 className="cat-h1">
        {category?.h1 || category?.name}
      </h1>

      {/* ✅ FRONTEND DESCRIPTION */}
      {category?.description && (
        <p className="cat-desc">
          {category.description}
        </p>
      )}

      {/* PRODUCTS */}
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
              <p>₹{p.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
          }
