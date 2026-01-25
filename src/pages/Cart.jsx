import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  // ✅ LOAD CART FROM LOCALSTORAGE
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // ✅ SAVE CART
  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ INCREASE
  const increaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  // ✅ DECREASE
  const decreaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    );
    updateCart(updated);
  };

  // ✅ MANUAL INPUT
  const changeQty = (id, value) => {
    const qty = Number(value);
    if (qty < 1 || isNaN(qty)) return;

    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty } : item
    );
    updateCart(updated);
  };

  // ✅ REMOVE ITEM
  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  // ✅ TOTAL COUNT (IMPORTANT)
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-page">
      <h2>Shopping Cart ({totalItems} items)</h2>

      {cartItems.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 40 }}>
          Cart is empty
        </p>
      )}

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          {/* IMAGE */}
          <img
            src={item.image || "/no-image.png"}
            alt={item.name}
          />

          <div className="cart-info">
            <h4>{item.name}</h4>
            <p>{item.brand}</p>
            <strong>₹{item.price}</strong>

            {/* ✅ SAME QUANTITY SYSTEM AS PRODUCT PAGE */}
            <div className="qty-box">
              <button onClick={() => decreaseQty(item.id)}>−</button>

              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) =>
                  changeQty(item.id, e.target.value)
                }
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
      )}
    </div>
  );
}
