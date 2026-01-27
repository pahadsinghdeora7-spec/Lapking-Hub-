import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);

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

  // ================= UPDATE =================
  const updateProduct = async () => {
    const { error } = await supabase
      .from("products")
      .update({
        name: openProduct.name,
        price: openProduct.price,
        stock: openProduct.stock,
        part_number: openProduct.part_number,
        category_slug: openProduct.category_slug,
        brand: openProduct.brand,
        description: openProduct.description
      })
      .eq("id", openProduct.id);

    if (!error) {
      alert("Product updated");
      setOpenProduct(null);
      fetchProducts();
    }
  };

  // ================= DELETE =================
  const deleteProduct = async () => {
    if (!window.confirm("Delete this product?")) return;

    await supabase
      .from("products")
      .delete()
      .eq("id", openProduct.id);

    setOpenProduct(null);
    fetchProducts();
  };

  return (
    <div className="admin-page">

      <h2>Products</h2>

      {/* ================= TABLE ================= */}
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
              <tr
                key={p.id}
                style={{ cursor: "pointer" }}
                onClick={() => setOpenProduct(p)}
              >
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

                <td>
                  <span style={{ color: "#2563eb", fontSize: 12 }}>
                    Click
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= POPUP ================= */}
      {openProduct && (
        <div className="modal-bg">
          <div className="modal-card">

            <h3>Product Details</h3>

            {openProduct.image && (
              <img
                src={openProduct.image}
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 10
                }}
              />
            )}

            <input
              value={openProduct.name || ""}
              onChange={(e) =>
                setOpenProduct({ ...openProduct, name: e.target.value })
              }
              placeholder="Product name"
            />

            <select
              value={openProduct.category_slug || ""}
              onChange={(e) =>
                setOpenProduct({
                  ...openProduct,
                  category_slug: e.target.value
                })
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
              value={openProduct.part_number || ""}
              onChange={(e) =>
                setOpenProduct({
                  ...openProduct,
                  part_number: e.target.value
                })
              }
              placeholder="Part Number"
            />

            <input
              value={openProduct.price || ""}
              onChange={(e) =>
                setOpenProduct({
                  ...openProduct,
                  price: e.target.value
                })
              }
              placeholder="Price"
            />

            <input
              value={openProduct.stock || ""}
              onChange={(e) =>
                setOpenProduct({
                  ...openProduct,
                  stock: e.target.value
                })
              }
              placeholder="Stock"
            />

            <textarea
              value={openProduct.description || ""}
              onChange={(e) =>
                setOpenProduct({
                  ...openProduct,
                  description: e.target.value
                })
              }
              placeholder="Description"
            />

            <div className="modal-actions">
              <button className="btn-primary" onClick={updateProduct}>
                Update
              </button>

              <button className="delete" onClick={deleteProduct}>
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
