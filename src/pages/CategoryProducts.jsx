// src/pages/CategoryProducts.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/dummyProducts";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { slug } = useParams();

  const filtered = products.filter(
    (p) => p.category?.toLowerCase() === slug.toLowerCase()
  );

  return (
    <div className="category-page">
      <h1 className="category-title">
        {slug.replace("-", " ").toUpperCase()}
      </h1>

      <div className="product-grid">
        {filtered.length === 0 && (
          <p style={{ textAlign: "center" }}>No products found</p>
        )}

        {filtered.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            className="product-card"
          >
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>
            <button>Add to Cart</button>
          </Link>
        ))}
      </div>
    </div>
  );
}
