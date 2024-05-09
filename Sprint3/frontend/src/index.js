import React from "react";
import { createRoot } from "react-dom/client"; // Changed import here
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Changed the way to get the root element
const container = document.getElementById("root");
const root = createRoot(container); // Use createRoot to create a root.

// Now use the root to render your App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
