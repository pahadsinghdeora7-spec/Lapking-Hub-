import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (!error && data) {
        setProduct(data);

        const { data: relatedData } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", data.category_id)
          .neq("id", data.id)
          .limit(8);

        setRelated(relatedData || []);
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (!product) return <div className="pd-error">Product not found</div>;

  return (
    <div className="pd-wrapper">

      {/* IMAGE SECTION */}
      <div className="pd-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* DETAILS */}
      <div className="pd-info">
        <h1>{product.name}</h1>

        <div className="pd-price">₹{product.price}</div>

        <div className="pd-meta">
          <p><b>Brand:</b> {product.brand || "-"}</p>
          <p><b>Part Number:</b> {product.part_number}</p>
          <p><b>Compatible Models:</b> {product.compatible_m}</p>
        </div>

        <div className="pd-buttons">
          <button className="buy-now">Buy Now</button>
          <button className="add-cart">Add to Cart</button>
          <a
            href={`https://wa.me/919873670361?text=I want to buy ${product.name}`}
            className="whatsapp"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="pd-description">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="pd-related">
          <h3>Related Products</h3>

          <div className="pd-related-grid">
            {related.map(item => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="pd-card"
              >
                <img src={item.image} />
                <div className="pd-card-name">{item.name}</div>
                <div className="pd-card-price">₹{item.price}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
      }
