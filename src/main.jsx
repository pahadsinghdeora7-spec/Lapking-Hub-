// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./Styles.css";

// ✅ loader context
import { LoaderProvider } from "./context/LoaderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ PURE APP ROOT */}
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </React.StrictMode>
);
