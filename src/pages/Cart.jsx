import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Lenovo Legion 5 15ARH05H, With Backlight Blue",
      brand: "Lenovo",
      price: 1250,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1587202372775-98973f2d3c7b",
    },
    {
      id: 2,
      name: "Dell Latitude E3490 TouchPad Palmrest Bottom Base",
      brand: "Dell",
      price: 1850,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    },
  ]);

  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <div className="cart-page">
      <h2>Shopping Cart ({cartItems.length} items)</h2>

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />

          <div className="cart-info">
            <h4>{item.name}</h4>
            <p>{item.brand}</p>
            <strong>₹{item.price}</strong>

            <div className="qty-box">
              <button onClick={() => decreaseQty(item.id)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>
          </div>

          <button className="delete-btn" onClick={() => removeItem(item.id)}>
            🗑
          </button>
        </div>
      ))}

      <div className="order-summary">
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>FREE</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout/address")}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
