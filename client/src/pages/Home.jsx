import { useContext } from "react";
import MainSection from "../components/main/MainSection";
import FormSection from "../components/main/FormSection";
import Quickies from "../components/main/Quickies";
import Quickies2 from "../components/main/Quickies2";
import { AppContext } from "../components/store/AppContext";

function Home() {
  const { preferredThemes, searchList } = useContext(AppContext);

  return (
    <>
      <MainSection />
      <FormSection />
      <Quickies />
      {preferredThemes.length > 0 && searchList.length > 0 && <Quickies2 />}
    </>
  );
}

export default Home;
