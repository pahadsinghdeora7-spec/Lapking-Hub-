// src/main.jsx
throw new Error("Lapking Hub TEST ERROR");

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./Styles.css";

import { LoaderProvider } from "./context/LoaderContext"; // ✅ ADD

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoaderProvider>      {/* ✅ WRAP APP */}
      <App />
    </LoaderProvider>
  </React.StrictMode>
);
