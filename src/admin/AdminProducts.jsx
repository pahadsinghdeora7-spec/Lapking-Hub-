import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    console.log("ADMIN PRODUCTS:", data, error);

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product List</h2>

      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && (
        <p>No products found</p>
      )}

      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <b>{p.name}</b>
          <br />
          Price: ₹{p.price}
          <br />
          Stock: {p.stock}
          <br />
          ID: {p.id}
        </div>
      ))}
    </div>
  );
}
