import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../pages/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  // 🔹 load product
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    setProduct(data);

    // related products (same category)
    if (data?.category_id) {
      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", data.category_id)
        .neq("id", id)
        .limit(6);

      setRelated(relatedData || []);
    }
  };

  if (!product) return null;

  return (
    <div className="product-details-page">

      {/* IMAGE */}
      <div className="pd-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* INFO */}
      <div className="pd-info">

        <h2>{product.name}</h2>

        <div className="pd-row">
          <span>Brand: {product.brand}</span>
          <span>Part No: {product.part_number}</span>
        </div>

        <div className="pd-price">₹{product.price}</div>

        <div
          className={
            product.stock > 0 ? "stock-in" : "stock-out"
          }
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>

        <button className="buy-btn">Buy Now</button>

        <button className="cart-btn">Add to Cart</button>

        <a
          className="whatsapp-btn"
          href={`https://wa.me/919873670361?text=I want ${product.name}`}
          target="_blank"
        >
          Order on WhatsApp
        </a>
      </div>

      {/* DESCRIPTION */}
      <div className="pd-description">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>

      {/* RELATED */}
      <div className="related-section">
        <h3>More Products</h3>

        <div className="related-grid">
          {related.map((item) => (
            <div
              key={item.id}
              className="related-card"
              onClick={() =>
                window.location.href = `/product/${item.id}`
              }
            >
              <img src={item.image} />
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
