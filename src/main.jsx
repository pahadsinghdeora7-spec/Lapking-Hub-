// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// IMPORTANT: yahi se hum CSS file load kar rahe hain
import './Styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* app-root class ko CSS me style kiya hai */}
    <div className="app-root">
      <App />
    </div>
  </React.StrictMode>
);
