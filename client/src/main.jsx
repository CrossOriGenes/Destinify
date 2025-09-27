// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import App from "./App.jsx";
import { ToastContainer, Zoom } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer
      position="bottom-left"
      autoClose={12000}
      newestOnTop={false}
      closeOnClick={true}
      draggable
      pauseOnHover
      pauseOnFocusLoss={false}
      theme="dark"
      transition={Zoom}
    />
    <App />
  </>
);
