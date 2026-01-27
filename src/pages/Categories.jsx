import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "../supabaseClient";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, h1, description")
      .eq("status", true)
      .order("id", { ascending: true });

    if (!error) {
      setCategories(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="cat-page">
      <Helmet>
        <title>All Categories | Lapking Hub</title>
        <meta
          name="description"
          content="Browse all laptop spare parts categories at Lapking Hub."
        />
      </Helmet>

      <h1 className="cat-title">All Categories</h1>
      <p className="cat-sub">
        Browse laptop spare parts by category
      </p>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && categories.length === 0 && (
        <p style={{ textAlign: "center" }}>No categories found</p>
      )}

      <div className="cat-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="cat-card"
          >
            <div className="cat-icon">📁</div>
            <h3>{cat.name}</h3>
            <span>Shop Now →</span>
          </Link>
        ))}
      </div>

      <div className="cat-seo-text">
        Lapking Hub – Wholesale laptop spare parts supplier in India.
      </div>
    </div>
  );
}
