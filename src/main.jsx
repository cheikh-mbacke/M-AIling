import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/globals.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => console.log("SW registered:", registration))
      .catch((err) => console.log("SW registration failed:", err));
  });
}