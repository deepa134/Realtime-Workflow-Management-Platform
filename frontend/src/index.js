// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Make sure the path is correct

// Get the root DOM element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
