import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(id))
      .single();

    setProduct(data);
    setLoading(false);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product not found</p>;

  return (
    <div style={{ padding: 15 }}>

      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          maxHeight: 320,
          objectFit: "cover",
          borderRadius: 10
        }}
      />

      {/* NAME */}
      <h2>{product.name}</h2>

      {/* PRICE */}
      <h3 style={{ color: "#111" }}>₹{product.price}</h3>

      {/* DETAILS */}
      <p><b>Brand:</b> {product.brand}</p>
      <p><b>Category:</b> {product.category_name || "Laptop Accessories"}</p>
      <p><b>Part Number:</b> {product.part_number}</p>
      <p><b>Compatible Models:</b> {product.compatible_models}</p>

      <p style={{ marginTop: 10 }}>{product.description}</p>

      {/* BUY BUTTONS */}
      <div style={{ marginTop: 20 }}>

        {/* BUY NOW */}
        <button
          onClick={() => navigate("/checkout/shipping")}
          style={{
            width: "100%",
            padding: 14,
            background: "#ff9f00",
            color: "#000",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            marginBottom: 10
          }}
        >
          Buy Now
        </button>

        {/* ADD TO CART */}
        <button
          onClick={() => navigate("/cart")}
          style={{
            width: "100%",
            padding: 14,
            background: "#2874f0",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            marginBottom: 10
          }}
        >
          Add to Cart
        </button>

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/919873670361?text=I want to order ${product.name}`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            style={{
              width: "100%",
              padding: 14,
              background: "green",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 16
            }}
          >
            Order on WhatsApp
          </button>
        </a>

      </div>

    </div>
  );
}
