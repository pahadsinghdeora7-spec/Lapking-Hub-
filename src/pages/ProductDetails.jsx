import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 8;

  // ======================
  // MAIN PRODUCT
  // ======================
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("status", true)
        .single();

      if (!error && data) {
        setProduct(data);
        setPage(0);
        setRelated([]);
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

  // ======================
  // RELATED PRODUCTS
  // ======================
  const loadRelated = async () => {
    if (!product) return;

    setLoadingMore(true);

    const from = page * limit;
    const to = from + limit - 1;

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .eq("status", true)
      .range(from, to);

    if (data && data.length > 0) {
      setRelated((prev) => [...prev, ...data]);
      setPage((p) => p + 1);
    }

    setLoadingMore(false);
  };

  // first related load
  useEffect(() => {
    if (product) {
      loadRelated();
    }
  }, [product]);

  // ======================
  // SCROLL LISTENER
  // ======================
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (!loadingMore) {
          loadRelated();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, product]);

  // ======================
  // UI STATES
  // ======================
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product not found</p>;

  return (
    <>
      {/* ================= PRODUCT DETAILS ================= */}

      {/* ⚠️ yaha tumhara existing Base44 design rahega */}
      {/* sirf data binding example diya hai */}

      <h2>{product.name}</h2>
      <p>₹{product.price}</p>
      <p><b>Brand:</b> {product.brand}</p>
      <p><b>Part Number:</b> {product.part_number}</p>
      <p><b>Compatible:</b> {product.compatible_models}</p>
      <p>{product.description}</p>

      {/* ================= RELATED PRODUCTS ================= */}

      <h3 style={{ marginTop: 40 }}>Related Products</h3>

      {related.map((item) => (
        <div key={item.id} style={{ marginBottom: 20 }}>
          <img src={item.image} width="120" />
          <p>{item.name}</p>
          <p>₹{item.price}</p>
        </div>
      ))}

      {loadingMore && (
        <p style={{ textAlign: "center", padding: 20 }}>
          Loading more...
        </p>
      )}
    </>
  );
        }
