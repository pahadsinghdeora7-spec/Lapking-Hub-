// src/pages/Cart.jsx

import React, { useState } from "react";
import "./Cart.css";

const demoCart = [
  {
    id: 1,
    name: "Lenovo Legion 5 15ARH05 Keyboard",
    brand: "Lenovo",
    price: 1250,
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    qty: 1,
  },
  {
    id: 2,
    name: "Dell Latitude E3490 Palmrest",
    brand: "Dell",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    qty: 1,
  },
];

const shippingMethods = [
  { id: 1, name: "India Post", price: 80 },
  { id: 2, name: "DTDC Courier", price: 120 },
  { id: 3, name: "Delhivery", price: 150 },
  { id: 4, name: "Local Courier", price: 50 },
];

export default function Cart() {
  const [cart, setCart] = useState(demoCart);
  const [shipping, setShipping] = useState(null);

  const updateQty = (id, type) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const total = subtotal + (shipping ? shipping.price : 0);

  return (
    <div className="cart-page">
      <h2>Shopping Cart ({cart.length} items)</h2>

      {/* CART ITEMS */}
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />

          <div className="cart-info">
            <h4>{item.name}</h4>
            <p className="brand">{item.brand}</p>
            <p className="price">₹{item.price}</p>

            <div className="qty-box">
              <button onClick={() => updateQty(item.id, "dec")}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, "inc")}>+</button>
            </div>
          </div>

          <button className="remove" onClick={() => removeItem(item.id)}>
            🗑
          </button>
        </div>
      ))}

      {/* SHIPPING */}
      <div className="shipping-box">
        <h3>Choose Delivery Method</h3>

        {shippingMethods.map((s) => (
          <label key={s.id} className="shipping-option">
            <input
              type="radio"
              name="shipping"
              onChange={() => setShipping(s)}
            />
            {s.name} — ₹{s.price}
          </label>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="summary-box">
        <div>
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div>
          <span>Shipping</span>
          <span>{shipping ? `₹${shipping.price}` : "Select"}</span>
        </div>

        <hr />

        <div className="total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button className="checkout-btn">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
      }
