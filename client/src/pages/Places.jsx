import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlacesListSection from "../components/places/PlacesListSection";
import Header from "../components/UI/Header";

function Places() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        <PlacesListSection />
      </main>
    </>
  );
}

export default Places;
