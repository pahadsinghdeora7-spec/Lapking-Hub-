import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setProduct(data);
      fetchRelated(data.category_id, data.id);
    }
  };

  const fetchRelated = async (categoryId, currentId) => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", currentId)
      .eq("status", true)
      .limit(6);

    setRelated(data || []);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">

      {/* PRODUCT MAIN */}
      <img
        src={product.image || product.image1}
        alt={product.name}
      />

      <h2>{product.name}</h2>
      <h3>₹{product.price}</h3>

      {product.compatible_model && (
        <p className="compatible">
          <strong>Compatible Models:</strong>{" "}
          {product.compatible_model}
        </p>
      )}

      {product.description && (
        <p className="description">{product.description}</p>
      )}

      <button className="add-btn">Add to Cart</button>

      {/* ================= RELATED PRODUCTS ================= */}

      {related.length > 0 && (
        <>
          <h3 className="related-title">Related Products</h3>

          <div className="related-grid">
            {related.map((item) => (
              <div
                key={item.id}
                className="related-card"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={item.image || item.image1}
                  alt={item.name}
                />
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
