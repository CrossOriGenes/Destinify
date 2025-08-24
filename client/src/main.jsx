import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import App from "./App.jsx";
import { ToastContainer, Bounce } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={8000}
      newestOnTop={false}
      closeOnClick={true}
      draggable
      pauseOnHover
      pauseOnFocusLoss={false}
      theme="dark"
      transition={Bounce}
    />
    <App />
  </StrictMode>
);
