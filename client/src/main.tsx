import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add critical CSS
const criticalStyles = `
  :root { background-color: #ffffff; }
  body { margin: 0; }
  #root { min-height: 100vh; }
`;

// Add critical styles first
const criticalStyleElement = document.createElement('style');
criticalStyleElement.setAttribute('id', 'critical-css');
criticalStyleElement.textContent = criticalStyles;
document.head.insertBefore(criticalStyleElement, document.head.firstChild);

// Add direct style to ensure white background in production
const styleElement = document.createElement('style');
styleElement.textContent = `
  html, body, #root {
    background-color: #ffffff !important;
    min-height: 100vh;
  }
`;
document.head.appendChild(styleElement);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<App />);
