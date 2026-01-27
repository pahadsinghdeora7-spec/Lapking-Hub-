import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminBulkDelete() {

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("id,name");
    setProducts(data || []);
  };

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (!window.confirm("Delete selected products?")) return;

    await supabase.from("products").delete().in("id", selected);
    alert("Products deleted ✅");
    loadProducts();
    setSelected([]);
  };

  return (
    <div className="admin-products">

      <h2>Bulk Delete Products</h2>

      <div className="card">

        {products.map(p => (
          <label key={p.id} style={{ display: "block", marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={selected.includes(p.id)}
              onChange={() => toggle(p.id)}
            />{" "}
            {p.name}
          </label>
        ))}

        <button
          className="save-btn"
          onClick={deleteSelected}
          style={{ background: "#ef4444" }}
        >
          Delete Selected
        </button>

      </div>

    </div>
  );
}
