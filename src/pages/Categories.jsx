import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "../supabaseClient";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("status", true)
      .order("id", { ascending: false });

    setCategories(data || []);
  };

  return (
    <div className="cat-page">
      <Helmet>
        <title>All Categories | Lapking Hub</title>
        <meta
          name="description"
          content="Browse all laptop spare parts categories at Lapking Hub including keyboards, batteries, DC jacks and more."
        />
      </Helmet>

      <h1 className="cat-title">All Categories</h1>
      <p className="cat-sub">
        Browse all laptop spare parts categories
      </p>

      <div className="cat-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="cat-card"
          >
            <h3>{cat.name}</h3>
            <span>Shop Now →</span>
          </Link>
        ))}
      </div>

      <div className="cat-seo-text">
        Lapking Hub is India’s trusted wholesale supplier of laptop spare parts.
      </div>
    </div>
  );
}
