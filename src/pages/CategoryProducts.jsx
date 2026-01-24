import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryProducts();
  }, [slug]);

  const loadCategoryProducts = async () => {
    setLoading(true);

    // ✅ STEP 1: category slug se category nikaalo
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (catError || !category) {
      console.error("Category not found");
      setProducts([]);
      setLoading(false);
      return;
    }

    // ✅ STEP 2: category_id se products lao
    const { data: productsData, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("status", true);

    if (prodError) {
      console.error("Product error", prodError);
      setProducts([]);
    } else {
      setProducts(productsData || []);
    }

    setLoading(false);
  };

  return (
    <div className="category-page">
      <h2 className="category-title">
        {slug.replace("-", " ").toUpperCase()}
      </h2>

      {loading && <p>Loading products...</p>}

      {!loading && products.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          No products found
        </p>
      )}

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
