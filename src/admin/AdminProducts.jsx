import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
  };

  // =====================
  // UPDATE PRODUCT
  // =====================
  const updateProduct = async () => {
    const { error } = await supabase
      .from("products")
      .update({
        name: edit.name,
        price: edit.price,
        stock: edit.stock,
        part_number: edit.part_number,
        brand: edit.brand,
        compatible_models: edit.compatible_models,
        description: edit.description,
        category_slug: edit.category_slug
      })
      .eq("id", edit.id);

    if (!error) {
      alert("Product updated");
      setEdit(null);
      fetchProducts();
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="admin-page">

      <h2>Products</h2>

      {/* ===================== */}
      {/* PRODUCT LIST */}
      {/* ===================== */}
      <div className="table-card">
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
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img src={p.image} className="thumb" />
                  ) : (
                    <div className="no-image">No image</div>
                  )}
                </td>

                <td>{p.name}</td>
                <td>{p.category_slug || "-"}</td>
                <td>{p.part_number}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>

                <td className="actions">
                  <button
                    className="edit"
                    onClick={() => setEdit(p)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================== */}
      {/* EDIT POPUP */}
      {/* ===================== */}
      {edit && (
        <div className="modal-bg">
          <div className="modal-card">

            <h3>Edit Product</h3>

            <input
              value={edit.name || ""}
              onChange={(e) =>
                setEdit({ ...edit, name: e.target.value })
              }
              placeholder="Product Name"
            />

            {/* ✅ CATEGORY */}
            <select
              value={edit.category_slug || ""}
              onChange={(e) =>
                setEdit({ ...edit, category_slug: e.target.value })
              }
            >
              <option value="">Select Category</option>
              <option value="dc-jack">DC Jack</option>
              <option value="keyboard">Keyboard</option>
              <option value="battery">Battery</option>
              <option value="charger">Charger</option>
              <option value="fan">Fan</option>
            </select>

            <input
              value={edit.price || ""}
              onChange={(e) =>
                setEdit({ ...edit, price: e.target.value })
              }
              placeholder="Price"
            />

            <input
              value={edit.stock || ""}
              onChange={(e) =>
                setEdit({ ...edit, stock: e.target.value })
              }
              placeholder="Stock"
            />

            <input
              value={edit.part_number || ""}
              onChange={(e) =>
                setEdit({ ...edit, part_number: e.target.value })
              }
              placeholder="Part Number"
            />

            <input
              value={edit.brand || ""}
              onChange={(e) =>
                setEdit({ ...edit, brand: e.target.value })
              }
              placeholder="Brand"
            />

            <textarea
              value={edit.compatible_models || ""}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  compatible_models: e.target.value
                })
              }
              placeholder="Compatible Models"
            />

            <textarea
              value={edit.description || ""}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  description: e.target.value
                })
              }
              placeholder="Description"
            />

            <div className="modal-actions">
              <button className="btn-primary" onClick={updateProduct}>
                Update
              </button>

              <button
                className="btn-outline"
                onClick={() => setEdit(null)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
                           }
