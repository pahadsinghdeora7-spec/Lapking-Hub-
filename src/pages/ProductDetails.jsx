import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PAGE_SIZE = 8;

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ================= PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id)
        .single();

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // ================= RELATED =================
  const fetchRelated = async () => {
    if (!product || loadingMore || !hasMore) return;

    setLoadingMore(true);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .range(from, to);

    if (!data || data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setRelated((prev) => [...prev, ...(data || [])]);
    setPage((prev) => prev + 1);
    setLoadingMore(false);
  };

  // product load hone ke baad hi related
  useEffect(() => {
    if (product) {
      setRelated([]);
      setPage(0);
      setHasMore(true);
      fetchRelated();
    }
  }, [product]);

  // ================= SCROLL =================
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 150
      ) {
        fetchRelated();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  // ================= UI =================
  if (loading) {
    return <p className="p-4">Loading product...</p>;
  }

  if (!product) {
    return <p className="p-4">Product not found</p>;
  }

  return (
    <div className="p-4">

      {/* PRODUCT */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded mb-4"
      />

      <h1 className="text-xl font-bold">{product.name}</h1>

      <p>Brand: <b>{product.brand}</b></p>
      <p>Category: <b>{product.categories?.name}</b></p>
      <p>Part Number: <b>{product.part_number}</b></p>
      <p>Compatible: <b>{product.compatible_model}</b></p>

      <p className="text-lg font-semibold mt-2">
        ₹{product.price}
      </p>

      <p className="mt-4">{product.description}</p>

      {/* RELATED */}
      <h2 className="text-lg font-bold mt-8 mb-3">
        Related Products
      </h2>

      {related.map((p) => (
        <div
          key={p.id}
          className="border rounded p-3 mb-3 flex gap-3"
          onClick={() => (window.location.href = `/product/${p.id}`)}
        >
          <img
            src={p.image}
            className="w-24 h-24 object-cover rounded"
            alt={p.name}
          />

          <div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">
              {p.compatible_model}
            </p>
            <p className="font-bold">₹{p.price}</p>
          </div>
        </div>
      ))}

      {loadingMore && (
        <p className="text-center py-4 text-gray-500">
          Loading more products...
        </p>
      )}

      {!hasMore && (
        <p className="text-center py-4 text-gray-400">
          No more products
        </p>
      )}
    </div>
  );
}
