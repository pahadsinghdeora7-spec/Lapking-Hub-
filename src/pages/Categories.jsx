import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet";

export default function CategoryProducts() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadCategory();
  }, [slug]);

  const loadCategory = async () => {
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!cat) return;

    setCategory(cat);

    const { data: prods } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", cat.id);

    setProducts(prods || []);
  };

  if (!category) {
    return <div style={{ padding: 20 }}>Category not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>{category.h1 || category.name}</title>
        <meta
          name="description"
          content={
            category.description ||
            `Buy ${category.name} online from Lapking Hub`
          }
        />
      </Helmet>

      <div style={{ padding: 16 }}>
        <h1>{category.h1 || category.name}</h1>
        <p style={{ color: "#666" }}>{category.description}</p>

        {products.length === 0 && (
          <p style={{ marginTop: 20 }}>No products found</p>
        )}
      </div>
    </>
  );
}
