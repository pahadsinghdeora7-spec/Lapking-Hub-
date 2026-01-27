import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      .select("id,name,slug")
      .order("id", { ascending: false });

    setCategories(data || []);
  };

  return (
    <div className="cat-page">

      <h1 className="cat-title">All Categories</h1>

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
