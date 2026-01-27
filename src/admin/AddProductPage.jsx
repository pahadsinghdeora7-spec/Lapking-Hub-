import React from "react";
import "./AddProductPage.css";

export default function AddProductPage() {
  return (
    <div className="add-page">

      <h2>Add Product</h2>

      <div className="card-box">

        <input placeholder="Product Name" />
        <input placeholder="Price" />
        <input placeholder="Stock" />
        <input placeholder="Part Number" />
        <input placeholder="Compatible Model" />

        <textarea placeholder="Product Description"></textarea>

        <label>Main Image</label>
        <input type="file" />

        <label>Image 1</label>
        <input type="file" />

        <label>Image 2</label>
        <input type="file" />

        <button className="save-btn">
          Save Product
        </button>

      </div>
    </div>
  );
}
