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

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", slug);

    if (!error) {
      setProducts(data || []);
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
