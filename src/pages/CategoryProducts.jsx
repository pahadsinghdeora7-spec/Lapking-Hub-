import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function CategoryProducts() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryAndProducts();
  }, [slug]);

  const loadCategoryAndProducts = async () => {
    setLoading(true);

    // ✅ 1. Category fetch (SEO H1 + description)
    const { data: cat } = await supabase
      .from("categories")
      .select("id, name, h1, description, slug")
      .eq("slug", slug)
      .single();

    if (!cat) {
      setCategory(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    setCategory(cat);

    // ✅ 2. Products fetch using category_slug
    const { data: prods } = await supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug)
      .order("id", { ascending: false });

    setProducts(prods || []);
    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!category) {
    return <div style={{ padding: 20 }}>Category not found</div>;
  }

  return (
    <div className="page-container">

      {/* ✅ SEO */}
      <Helmet>
        <title>{category.h1 || category.name} | Lapking Hub</title>
        <meta
          name="description"
          content={
            category.description ||
            `Buy ${category.name} laptop spare parts at best price in India`
          }
        />
      </Helmet>

      {/* ✅ H1 (Google SEO) */}
      <h1 className="category-title">
        {category.h1 || category.name}
      </h1>

      {/* ✅ SEO description visible */}
      {category.description && (
        <p className="category-description">
          {category.description}
        </p>
      )}

      {/* ✅ PRODUCTS */}
      {products.length === 0 ? (
        <p style={{ marginTop: 20 }}>
          No products found in this category
        </p>
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
