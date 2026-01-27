import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";
import ProductCard from "../components/ProductCard";

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

    // ✅ category data (H1 + description)
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

    // ✅ products of category
    const { data: prod } = await supabase
      .from("products")
      .select("*")
      .eq("category", cat.name);

    setProducts(prod || []);
    setLoading(false);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!category) return <p style={{ padding: 20 }}>Category not found</p>;

  return (
    <>
      {/* ✅ SEO */}
      <Helmet>
        <title>
          {category.h1
            ? category.h1
            : `${category.name} | LapkingHub`}
        </title>

        {category.description && (
          <meta
            name="description"
            content={category.description}
          />
        )}
      </Helmet>

      <div style={{ padding: "16px" }}>
        {/* ✅ H1 visible on page */}
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>
          {category.h1 || category.name}
        </h1>

        {category.description && (
          <p style={{ color: "#666", marginBottom: 20 }}>
            {category.description}
          </p>
        )}

        {/* PRODUCTS */}
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
        }
