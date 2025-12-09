import React from 'react';

export default function Cart() {
  // Abhi dummy data; baad me real cart logic add karenge
  const subtotal = 750;
  const shipping = 99;
  const total = subtotal + shipping;

  return (
    <div className="page">
      <h3 className="section-title">Order Summary</h3>

      <div className="card">
        <div className="row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="row">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>
        <p className="small-text">
          Free shipping on orders above ₹999
        </p>
        <hr />
        <div className="row total-row">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button className="primary-btn full">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
    }
