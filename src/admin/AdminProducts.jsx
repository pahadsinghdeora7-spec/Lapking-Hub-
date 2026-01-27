import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openProduct, setOpenProduct] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Products</h2>

        <div className="top-actions">
          <button className="btn-outline">Bulk Upload</button>
          <button className="btn-primary">+ Add Product</button>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading">Loading products...</div>
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
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img src={p.image} className="thumb" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>

                  <td>{p.name}</td>
                  <td>{p.category_slug || "-"}</td>
                  <td>{p.part_number || "-"}</td>
                  <td>₹{p.price || 0}</td>
                  <td>{p.stock || 0}</td>

                  <td>
                    <div className="actions">
                      <button
                        className="edit"
                        onClick={() => setOpenProduct(p)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() => deleteProduct(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= POPUP ================= */}

      {openProduct && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Product Details</h3>

            <div className="image-row">
              {/* MAIN IMAGE */}
              <div className="img-box">
                <label>Main Image</label>
                {openProduct.image ? (
                  <img src={openProduct.image} className="thumb" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <input type="file" />
              </div>

              {/* IMAGE 1 */}
              <div className="img-box">
                <label>Image 1</label>
                {openProduct.image1 ? (
                  <img src={openProduct.image1} className="thumb" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <input type="file" />
              </div>

              {/* IMAGE 2 */}
              <div className="img-box">
                <label>Image 2</label>
                {openProduct.image2 ? (
                  <img src={openProduct.image2} className="thumb" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <input type="file" />
              </div>
            </div>

            <input value={openProduct.name || ""} readOnly />
            <input value={openProduct.price || ""} readOnly />
            <input value={openProduct.stock || ""} readOnly />
            <input value={openProduct.part_number || ""} readOnly />
            <textarea
              value={openProduct.description || ""}
              readOnly
            ></textarea>

            <div className="popup-actions">
              <button className="btn-primary">Update</button>
              <button
                className="btn-danger"
                onClick={() => deleteProduct(openProduct.id)}
              >
                Delete
              </button>
              <button
                className="btn-outline"
                onClick={() => setOpenProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
                        }
