import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import "../ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setProduct(data);
      loadRelated(data.category);
    }
  }

  async function loadRelated(category) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", id)
      .limit(10);

    setRelated(data || []);
  }

  if (!product) {
    return <div style={{ padding: 20 }}>Loading product...</div>;
  }

  return (
    <div className="product-details-page">

      {/* ================= MAIN PRODUCT ================= */}
      <div className="product-main">

        <img
          src={product.image || "/no-image.png"}
          alt={product.name}
          className="product-image"
        />

        <div className="product-info">
          <h2>{product.name}</h2>

          <p><b>Brand:</b> {product.brand}</p>
          <p><b>Part No:</b> {product.part_no}</p>
          <p><b>Category:</b> {product.category}</p>

          <h3>₹{product.price}</h3>

          <p className="stock">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button className="add-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <>
          <h3 className="related-title">
            Related Products
          </h3>

          <div className="related-scroll">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
                }
