import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);

    // 🔹 CATEGORY DATA
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!cat) {
      setCategory(null);
      setLoading(false);
      return;
    }

    setCategory(cat);

    // 🔹 PRODUCTS DATA
    const { data: prod } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug)
      .eq("status", true)
      .order("id", { ascending: false });

    setProducts(prod || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="cat-loading">Loading...</div>;
  }

  if (!category) {
    return <div className="cat-not-found">Category not found</div>;
  }

  return (
    <div className="category-page">
      <Helmet>
        <title>{category.h1 || category.name} | Lapking Hub</title>
        <meta
          name="description"
          content={
            category.description ||
            `Buy ${category.name} laptop spare parts online from Lapking Hub.`
          }
        />
      </Helmet>

      {/* SEO CONTENT */}
      <h1 className="category-title">
        {category.h1 || category.name}
      </h1>

      {category.description && (
        <p className="category-desc">
          {category.description}
        </p>
      )}

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <div className="no-products">
          No products found in this category
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
