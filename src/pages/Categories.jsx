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
      {/* SEO MAIN HEADING */}
      <h1 className="cat-h1">
        Laptop Replacement Spare Parts Categories
      </h1>

      {/* SEO DESCRIPTION */}
      <p className="cat-desc">
        Lapking Hub is a trusted wholesale supplier of laptop replacement spare
        parts in India. Browse our complete range of laptop replacement
        keyboards, laptop body parts, DC power jacks, cooling fans, speakers,
        batteries and other compatible laptop accessories for HP, Dell, Lenovo,
        Acer, Asus and more.
      </p>

      {/* CATEGORY GRID */}
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

      {/* EXTRA SEO TEXT (BOTTOM) */}
      <div className="cat-seo-text">
        <h2>Laptop Replacement Parts Available at Lapking Hub</h2>
        <p>
          We deal in laptop replacement keyboards, laptop replacement body
          panels, palmrest & top cover sets, laptop cooling fans, DC power
          jacks, speakers and internal accessories. All products are suitable
          for bulk buyers, repair centers and resellers across India.
        </p>
      </div>
    </div>
  );
}
