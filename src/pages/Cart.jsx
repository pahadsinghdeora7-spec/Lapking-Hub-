import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth"; // ✅ LOGIN CHECK
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  // 🔥 CART FROM LOCAL STORAGE
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // 🔁 UPDATE CART STORAGE + HEADER COUNT
  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ➕
  const increaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  // ➖
  const decreaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    );
    updateCart(updated);
  };

  // ❌ REMOVE
  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  // 💰 TOTAL
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // 🔐 CHECK LOGIN BEFORE CHECKOUT
  const handleCheckout = async () => {
    const user = await getCurrentUser();

    if (!user) {
      // ❌ not logged in → go login
      navigate("/login", {
        state: { from: "/checkout/address" }
      });
    } else {
      // ✅ logged in → go checkout
      navigate("/#/checkout/address");
    }
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart ({cartItems.length} items)</h2>

      {cartItems.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 30 }}>
          Cart is empty
        </p>
      )}

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          {/* IMAGE */}
          <img src={item.image} alt={item.name} />

          {/* INFO */}
          <div className="cart-info">
            <h4>{item.name}</h4>
            <p>{item.brand}</p>
            <strong>₹{item.price}</strong>

            {/* QUANTITY */}
            <div className="qty-box">
              <button onClick={() => decreaseQty(item.id)}>−</button>

              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => {
                  const val = Number(e.target.value) || 1;
                  const updated = cartItems.map((p) =>
                    p.id === item.id ? { ...p, qty: val } : p
                  );
                  updateCart(updated);
                }}
              />

              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>
          </div>

          {/* DELETE */}
          <button
            className="delete-btn"
            onClick={() => removeItem(item.id)}
          >
            🗑
          </button>
        </div>
      ))}

      {/* ORDER SUMMARY */}
      {cartItems.length > 0 && (
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row courier-row">
            <span>Courier Charges</span>
            <span className="courier-note">
              Not included (as per company rates)
            </span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          {/* 🔥 ONLY CHANGE HERE */}
          <button
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to Checkout →
          </button>
        </div>
      )}
    </div>
  );
          }
