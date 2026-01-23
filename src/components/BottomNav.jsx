import React from "react";
import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "#fff",
      borderTop: "1px solid #eee",
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0",
      zIndex: 1000
    }}>
      <Link to="/">Home</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/account">Account</Link>
    </div>
  );
}
