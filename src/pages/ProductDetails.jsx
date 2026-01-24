import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name)
      `)
      .eq("id", id)
      .single();

    if (!error && data) {
      setProduct({
        ...data,
        category_name: data.categories?.name || ""
      });

      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", data.category_id)
        .neq("id", data.id)
        .limit(10);

      setRelated(relatedData || []);
    }

    setLoading(false);
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  if (!product) {
    return <p style={{ padding: 20 }}>Product not found</p>;
  }

  return (
    <div className="product-page">

      {/* IMAGE */}
      <div className="product-image-box">
        <img src={product.image} alt={product.name} />
      </div>

      {/* INFO */}
      <div className="product-info">
        <h1>{product.name}</h1>

        <div className="price">₹{product.price}</div>

        <div className="meta">
          <p><b>Brand:</b> {product.brand || "-"}</p>
          <p><b>Category:</b> {product.category_name || "-"}</p>
          <p><b>Part Number:</b> {product.part_number || "-"}</p>
        </div>

        <div className="box">
          <h3>Description</h3>
          <p>{product.description || "No description available"}</p>
        </div>

        <div className="box">
          <h3>Compatible Models</h3>
          <p>{product.compatible_model || "-"}</p>
        </div>

        {/* BUTTONS */}
        <button className="btn buy">Buy Now</button>
        <button className="btn cart">Add to Cart</button>

        <a
          href={`https://wa.me/919873670361?text=I want to order ${product.name}`}
          target="_blank"
          rel="noreferrer"
        >
          <button className="btn whatsapp">Order on WhatsApp</button>
        </a>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="related-section">
          <h3>Related Products</h3>

          {related.map((item) => (
            <div key={item.id} className="related-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p className="r-name">{item.name}</p>
                <p className="r-price">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
