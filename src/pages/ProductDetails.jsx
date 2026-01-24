import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 8;

  // ================= FETCH MAIN PRODUCT =================
  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .single();

    setProduct(data);
  };

  // ================= FETCH RELATED =================
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

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setRelated([]);
      setPage(0);
      setHasMore(true);
      fetchRelated();
    }
  }, [product]);

  // ================= SCROLL LISTENER =================
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        fetchRelated();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [product, page, hasMore]);

  if (!product) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">

      {/* ================= PRODUCT DETAILS ================= */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded mb-4"
      />

      <h1 className="text-xl font-bold">{product.name}</h1>

      <p className="text-gray-600 mt-1">
        Brand: <b>{product.brand}</b>
      </p>

      <p className="mt-1">
        Category: <b>{product.categories?.name}</b>
      </p>

      <p className="mt-1">
        Part Number: <b>{product.part_number}</b>
      </p>

      <p className="mt-1">
        Compatible: <b>{product.compatible_model}</b>
      </p>

      <p className="text-lg font-semibold mt-3">₹{product.price}</p>

      <p className="mt-4 text-gray-700">{product.description}</p>

      {/* ================= RELATED ================= */}
      <h2 className="text-lg font-bold mt-10 mb-4">
        Related Products
      </h2>

      <div className="space-y-4">
        {related.map((p) => (
          <div
            key={p.id}
            className="border rounded p-3 flex gap-3"
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
              <p className="font-bold mt-1">₹{p.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= LOADER ================= */}
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
