import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./adminproducts.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [edit, setEdit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [mainImg, setMainImg] = useState(null);
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  const openEdit = (item) => {
    setEdit(item);
    setShowEdit(true);
  };

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from("products").upload(fileName, file);
    return supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;
  };

  const updateProduct = async () => {
    let image = edit.image;
    let image1 = edit.image1;
    let image2 = edit.image2;

    if (mainImg) image = await uploadImage(mainImg);
    if (img1) image1 = await uploadImage(img1);
    if (img2) image2 = await uploadImage(img2);

    await supabase
      .from("products")
      .update({
        name: edit.name,
        price: edit.price,
        stock: edit.stock,
        part_number: edit.part_number,
        brand: edit.brand,
        compatible_models: edit.compatible_models,
        description: edit.description,
        image,
        image1,
        image2,
      })
      .eq("id", edit.id);

    alert("Product updated successfully ✅");

    setShowEdit(false);
    setEdit(null);
    setMainImg(null);
    setImg1(null);
    setImg2(null);

    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="admin-page">
      <h2>Products</h2>

      {loading && <div className="loading">Loading...</div>}

      {!loading && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Part No</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img src={item.image} className="thumb" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>

                  <td>{item.name}</td>
                  <td>{item.part_number}</td>
                  <td>₹{item.price}</td>
                  <td>{item.stock}</td>

                  <td className="actions">
                    <button
                      className="edit"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteProduct(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="loading">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}

      {showEdit && edit && (
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

            <input
              value={edit.compatible_models || ""}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  compatible_models: e.target.value,
                })
              }
              placeholder="Compatible Models"
            />

            <textarea
              value={edit.description || ""}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <label>Main Image</label>
            <input type="file" onChange={(e) => setMainImg(e.target.files[0])} />

            <label>Image 1</label>
            <input type="file" onChange={(e) => setImg1(e.target.files[0])} />

            <label>Image 2</label>
            <input type="file" onChange={(e) => setImg2(e.target.files[0])} />

            <div className="modal-actions">
              <button className="btn-primary" onClick={updateProduct}>
                Update
              </button>

              <button
                className="btn-outline"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
