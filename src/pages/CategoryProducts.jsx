import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "../supabaseClient";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    setLoading(true);

    // 1️⃣ category find by slug
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!cat) {
      setCategory(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    setCategory(cat);

    // 2️⃣ products by category NAME
    const { data: prods } = await supabase
      .from("products")
      .select("*")
      .ilike("category", cat.name);

    setProducts(prods || []);
    setLoading(false);
  };

  if (loading) return <p className="cat-loading">Loading...</p>;

  if (!category)
    return <p className="cat-loading">Category not found</p>;

  return (
    <div className="cat-page">

      <Helmet>
        <title>{category.h1 || category.name}</title>
        <meta
          name="description"
          content={category.description || category.name}
        />
      </Helmet>

      <h1 className="cat-h1">
        {category.h1 || category.name}
      </h1>

      {category.description && (
        <p className="cat-desc">{category.description}</p>
      )}

      {products.length === 0 ? (
        <p className="cat-empty">
          No products found in this category
        </p>
      ) : (
        <div className="cat-grid">
          {products.map((p) => (
            <div className="cat-card" key={p.id}>
              <img
                src={p.image || "/no-image.png"}
                alt={p.name}
              />
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
