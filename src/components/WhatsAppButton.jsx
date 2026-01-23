import React from "react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919873670361"
      target="_blank"
      rel="noreferrer"
      style={{
        position: "fixed",
        bottom: "70px",
        right: "15px",
        background: "#25D366",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "50px",
        textDecoration: "none",
        fontWeight: "bold",
        zIndex: 1000
      }}
    >
      WhatsApp
    </a>
  );
}
