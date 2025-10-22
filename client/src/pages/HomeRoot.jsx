import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import EndLinks from "../components/main/EndLinks";
import Header from "../components/UI/Header";
import GotoTopButton from "../components/UI/GotoTopButton";

function HomeRoot() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <EndLinks />

      <GotoTopButton />
    </>
  );
}

export default HomeRoot;
