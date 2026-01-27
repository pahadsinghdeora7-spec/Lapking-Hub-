import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="cat-loading">Loading categories...</div>;
  }

  return (
    <div className="cat-page">
      <h1 className="cat-h1">All Categories</h1>

      <p className="cat-desc">
        Browse laptop spare parts categories at Lapking Hub.
      </p>

      <div className="cat-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="cat-card"
          >
            <h3>{cat.name}</h3>
            <span>View Products →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
