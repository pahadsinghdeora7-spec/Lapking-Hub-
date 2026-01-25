import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/auth";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    updateCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    updateCart(
      cartItems.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    updateCart(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // 🔐 FINAL SAFE CHECKOUT
  const handleCheckout = async () => {
    const user = await getCurrentUser();

    if (!user) {
      // login page
      window.location.hash = "#/login";
    } else {
      // checkout address
      window.location.hash = "#/checkout/address";
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
          <img src={item.image} alt={item.name} />

          <div className="cart-info">
            <h4>{item.name}</h4>
            <p>{item.brand}</p>
            <strong>₹{item.price}</strong>

            <div className="qty-box">
              <button onClick={() => decreaseQty(item.id)}>−</button>

              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => {
                  const val = Number(e.target.value) || 1;
                  updateCart(
                    cartItems.map((p) =>
                      p.id === item.id ? { ...p, qty: val } : p
                    )
                  );
                }}
              />

              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>
          </div>

          <button
            className="delete-btn"
            onClick={() => removeItem(item.id)}
          >
            🗑
          </button>
        </div>
      ))}

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

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout →
          </button>
        </div>
      )}
    </div>
  );
}
