import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/UI/Header";
import GotoTopButton from "../components/UI/GotoTopButton";
import MainSection from "../components/main/MainSection";
import FormSection from "../components/main/FormSection";
import Quickies from "../components/main/Quickies";
import EndLinks from "../components/main/EndLinks";

function Home() {
  const { pathname } = useLocation();
  
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
      </main>
      <EndLinks />

      <GotoTopButton />
    </>
  );
}

export default Home;
