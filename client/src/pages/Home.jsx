import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../components/store/AppContext";
import MainSection from "../components/main/MainSection";
import FormSection from "../components/main/FormSection";
import Quickies from "../components/main/Quickies";
import Quickies2 from "../components/main/Quickies2";
import EndLinks from "../components/main/EndLinks";
import Header from "../components/UI/Header";
import GotoTopButton from "../components/UI/GotoTopButton";

function Home() {
  const { pathname } = useLocation();
  const { preferredThemes, searchList } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        <MainSection />
        <FormSection />
        <Quickies />
        {preferredThemes.length > 0 && searchList.length > 0 && <Quickies2 />}
      </main>
      <EndLinks />

      <GotoTopButton />
    </>
  );
}

export default Home;
