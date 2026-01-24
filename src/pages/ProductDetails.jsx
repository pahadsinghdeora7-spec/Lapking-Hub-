import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const LIMIT = 8;

  // ======================
  // LOAD MAIN PRODUCT
  // ======================
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .single();

    setProduct(data);
    setRelated([]);
    setPage(0);
  };

  // ======================
  // LOAD RELATED PRODUCTS
  // ======================
  const loadRelated = async () => {
    if (!product) return;

    setLoadingMore(true);

    const from = page * LIMIT;
    const to = from + LIMIT - 1;

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .range(from, to);

    setRelated(prev => [...prev, ...(data || [])]);
    setPage(prev => prev + 1);
    setLoadingMore(false);
  };

  // auto load first related
  useEffect(() => {
    if (product) loadRelated();
  }, [product]);

  // ======================
  // SCROLL LOAD
  // ======================
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 150
      ) {
        if (!loadingMore) loadRelated();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, product]);

  if (!product) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 15 }}>

      {/* PRODUCT INFO */}
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", borderRadius: 10 }}
      />

      <h2>{product.name}</h2>
      <h3>₹{product.price}</h3>

      <p><b>Brand:</b> {product.brand}</p>
      <p><b>Category:</b> {product.categories?.name}</p>
      <p><b>Part Number:</b> {product.part_number}</p>

      <p><b>Compatible Models:</b><br />{product.compatible_model}</p>

      <p>{product.description}</p>

      {/* BUTTONS */}
      <button className="buy-btn">Buy Now</button>
      <button className="cart-btn">Add to Cart</button>
      <button className="wa-btn">Order on WhatsApp</button>

      {/* RELATED PRODUCTS */}
      <h3 style={{ marginTop: 30 }}>Related Products</h3>

      {related.map(item => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 15,
            borderBottom: "1px solid #eee",
            paddingBottom: 10
          }}
        >
          <img
            src={item.image}
            style={{ width: 90, borderRadius: 6 }}
          />

          <div>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
          </div>
        </div>
      ))}

      {loadingMore && (
        <p style={{ textAlign: "center", padding: 20 }}>
          Loading more products...
        </p>
      )}

    </div>
  );
  }
