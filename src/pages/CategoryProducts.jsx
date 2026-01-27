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

    // ✅ CATEGORY
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

    // ✅ PRODUCTS
    const { data: prod } = await supabase
      .from("products")
      .select("*")
      .eq("category", cat.name)
      .order("id", { ascending: false });

    setProducts(prod || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="cat-loading">Loading...</div>;
  }

  if (!category) {
    return <div className="cat-empty">Category not found</div>;
  }

  return (
    <div className="category-page">

      {/* SEO */}
      <Helmet>
        <title>{category.h1 || category.name} | Lapking Hub</title>
        <meta
          name="description"
          content={
            category.description ||
            `Buy ${category.name} laptop spare parts online at Lapking Hub`
          }
        />
      </Helmet>

      {/* H1 */}
      <h1 className="category-title">
        {category.h1 || category.name}
      </h1>

      {/* DESCRIPTION */}
      {category.description && (
        <p className="category-description">
          {category.description}
        </p>
      )}

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <div className="cat-empty">
          No products found in this category
        </div>
      ) : (
        <div className="category-products">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
