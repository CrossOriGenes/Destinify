import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Error404 from "./components/UI/Error404";
import AppLoader from "./components/UI/AppLoader";
import RouteProtector from "./components/store/RouteProtector";

const Root = lazy(() => import("./pages/Root"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/ProfilePage"));
const Places = lazy(() => import("./pages/Places"));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPswrdRoot = lazy(() => import("./pages/ResetPswrdRoot"));
const VerifyOtp = lazy(() => import("./components/auth/VerifyOtp"));
const ForgotPswrd = lazy(() => import("./components/auth/ForgotPswrd"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));

const router = createBrowserRouter([
  {
    path: "",
    errorElement: <Error404 />,
    index: true,
    element: <Root />,
  },
  { path: "places", element: <Places /> },
  { path: "places/:id", element: <PlaceDetails /> },
  { path: "auth", element: <Auth /> },
  {
    path: "home",
    element: (
      <RouteProtector>
        <Home />
      </RouteProtector>
    ),
  },
  {
    path: "home/profile",
    element: (
      <RouteProtector>
        <Profile />
      </RouteProtector>
    ),
  },
  {
    path: "forgot-password",
    element: <ResetPswrdRoot />,
    children: [
      { index: true, element: <ForgotPswrd /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
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

  return (
    <Suspense fallback={<AppLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
