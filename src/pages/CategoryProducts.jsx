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
    loadData();
  }, [slug]);

  const loadData = async () => {
    setLoading(true);

    // ✅ CATEGORY BY SLUG
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

    // ✅ PRODUCTS BY CATEGORY SLUG
    const { data: prods } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug)
      .order("id", { ascending: false });

    setProducts(prods || []);
    setLoading(false);
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  if (!category) return <div className="page-loading">Category not found</div>;

  return (
    <div className="category-page">

      {/* SEO */}
      <Helmet>
        <title>{category.h1 || category.name} | Lapking Hub</title>
        {category.description && (
          <meta name="description" content={category.description} />
        )}
      </Helmet>

      {/* SEO CONTENT */}
      <h1 className="cat-h1">
        {category.h1 || category.name}
      </h1>

      {category.description && (
        <p className="cat-desc">{category.description}</p>
      )}

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <p className="no-products">
          No products found in this category
        </p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
