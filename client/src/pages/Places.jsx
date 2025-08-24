import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlacesListSection from "../components/places/PlacesListSection";
import Header from "../components/UI/Header";
import EndLinks from "../components/places/EndLinks";
import GotoTopButton from "../components/UI/GotoTopButton";

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
      <EndLinks />
      
      <GotoTopButton />
    </>
  );
}

export default Places;
