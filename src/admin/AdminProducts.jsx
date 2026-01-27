import React, { useEffect, useState } from "react";
import "./adminProducts.css";
import { supabase } from "../supabaseClient";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  const openPopup = (product) => {
    setSelected({ ...product });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelected(null);
  };

  const updateProduct = async () => {
    const { error } = await supabase
      .from("products")
      .update({
        name: selected.name,
        price: selected.price,
        stock: selected.stock,
        part_number: selected.part_number,
        description: selected.description,
        category_slug: selected.category_slug,
        brand: selected.brand,
      })
      .eq("id", selected.id);

    if (!error) {
      alert("Product updated");
      closePopup();
      fetchProducts();
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="admin-page">
      <h2>Products</h2>

      <div className="table-card">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Part No</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} onClick={() => openPopup(p)}>
                  <td>
                    {p.image ? (
                      <img src={p.image} className="thumb" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category_slug || "-"}</td>
                  <td>{p.part_number}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(p.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* POPUP */}
      {showPopup && selected && (
        <div className="popup-bg">
          <div className="popup-box">
            <h3>Edit Product</h3>

            <label>Product Name</label>
            <input
              value={selected.name || ""}
              onChange={(e) =>
                setSelected({ ...selected, name: e.target.value })
              }
            />

            <label>Category</label>
            <input
              value={selected.category_slug || ""}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  category_slug: e.target.value,
                })
              }
            />

            <label>Price</label>
            <input
              value={selected.price || ""}
              onChange={(e) =>
                setSelected({ ...selected, price: e.target.value })
              }
            />

            <label>Stock</label>
            <input
              value={selected.stock || ""}
              onChange={(e) =>
                setSelected({ ...selected, stock: e.target.value })
              }
            />

            <label>Part Number</label>
            <input
              value={selected.part_number || ""}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  part_number: e.target.value,
                })
              }
            />

            <label>Description</label>
            <textarea
              rows="4"
              value={selected.description || ""}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  description: e.target.value,
                })
              }
            />

            <div className="popup-actions">
              <button className="save" onClick={updateProduct}>
                Update
              </button>
              <button className="danger" onClick={() => deleteProduct(selected.id)}>
                Delete
              </button>
              <button className="cancel" onClick={closePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
