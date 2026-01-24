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

    // 🔹 convert slug → normal name
    const categoryName = slug.replace("-", " ");

    // 1️⃣ get category
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("*")
      .ilike("name", categoryName)
      .single();

    if (catError || !category) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // 2️⃣ get products using category_id
    const { data: productData, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("status", true);

    if (!prodError) {
      setProducts(productData || []);
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
          No products found in this category
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
