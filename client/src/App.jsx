import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Root from "./pages/Root";
import Error404 from "./components/UI/Error404";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "",
    errorElement: <Error404 />,
    index: true,
    element: <Root />,
  },
  {
    path: "home",
    children: [{ index: true, element: <Home /> }],
  },
]);

function App() {
  useEffect(() => {
    AOS.init({
      disable: false,
      delay: 50,
      duration: 900,
      easing: "ease",
      once: true,
      throttleDelay: 200,
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
