import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Error404 from "./components/UI/Error404";
import AppLoader from "./components/UI/AppLoader";

const Root = lazy(() => import("./pages/Root"));
const Home = lazy(() => import("./pages/Home"));
const Places = lazy(() => import("./pages/Places"));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails"));

const router = createBrowserRouter([
  {
    path: "",
    errorElement: <Error404 />,
    index: true,
    element: <Root />,
  },
  { path: "home", element: <Home /> },
  { path: "places", element: <Places /> },
  { path: "places/:id", element: <PlaceDetails /> },
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

  return (
    <Suspense fallback={<AppLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
