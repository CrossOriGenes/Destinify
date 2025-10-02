import { createRoot } from "react-dom/client";
import "./assets/index.css";
import { ToastContainer, Zoom } from "react-toastify";
import App from "./App.jsx";
import { AppContextProvider } from "./components/store/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <AppContextProvider>
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
  </AppContextProvider>
);
