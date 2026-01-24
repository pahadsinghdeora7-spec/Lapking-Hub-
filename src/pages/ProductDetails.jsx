import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);

    // MAIN PRODUCT
    const { data: productData, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name)
      `)
      .eq("id", id)
      .single();

    if (error || !productData) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct({
      ...productData,
      category_name: productData.categories?.name || ""
    });

    // RELATED PRODUCTS (same category)
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", productData.category_id)
      .neq("id", productData.id)
      .limit(8);

    setRelatedProducts(related || []);
    setLoading(false);
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product not found</p>;

  return (
    <div className="pd-container">

      {/* IMAGE */}
      <div className="pd-image-box">
        <img src={product.image} alt={product.name} />
      </div>

      {/* DETAILS */}
      <div className="pd-info">
        <h1>{product.name}</h1>

        <p className="pd-price">₹{product.price}</p>

        <p><b>Brand:</b> {product.brand}</p>
        <p><b>Category:</b> {product.category_name}</p>
        <p><b>Part Number:</b> {product.part_number}</p>

        <p className="pd-compatible">
          <b>Compatible Models:</b><br />
          {product.compatible_models}
        </p>

        {/* BUTTONS */}
        <div className="pd-buttons">
          <button className="buy-btn">Buy Now</button>
          <button className="cart-btn">Add to Cart</button>

          <a
            className="wa-btn"
            href={`https://wa.me/919873670361?text=I want to buy ${product.name}`}
            target="_blank"
            rel="noreferrer"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="pd-desc">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="pd-related">
        <h3>Related Products</h3>

        {relatedProducts.map((item) => (
          <div
            key={item.id}
            className="pd-related-card"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img src={item.image} alt={item.name} />
            <div>
              <p className="rp-name">{item.name}</p>
              <p className="rp-price">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
