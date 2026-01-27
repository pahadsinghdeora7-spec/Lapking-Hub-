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
    fetchCategory();
  }, [slug]);

  const fetchCategory = async () => {
    setLoading(true);

    // 🔹 category fetch
    const { data: cat, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !cat) {
      setCategory(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    setCategory(cat);

    // 🔹 products fetch
    const { data: prods } = await supabase
      .from("products")
      .select("*")
      .eq("category", cat.name)
      .order("id", { ascending: false });

    setProducts(prods || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="cat-loading">Loading...</div>;
  }

  if (!category) {
    return <div className="cat-notfound">Category not found</div>;
  }

  return (
    <div className="category-page">

      {/* 🔥 SEO */}
      <Helmet>
        <title>{category.h1 || category.name}</title>
        <meta
          name="description"
          content={category.description || category.name}
        />
      </Helmet>

      {/* 🔹 H1 visible (SEO + user) */}
      <h1 className="category-h1">
        {category.h1 || category.name}
      </h1>

      {/* 🔹 description */}
      {category.description && (
        <p className="category-desc">
          {category.description}
        </p>
      )}

      {/* 🔹 PRODUCTS */}
      {products.length === 0 ? (
        <div className="no-products">
          No products found in this category
        </div>
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
