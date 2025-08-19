import Header from "../components/UI/Header";
import GotoTopButton from "../components/UI/GotoTopButton";
import MainSection from "../components/main/MainSection";
import FormSection from "../components/main/FormSection";
import Quickies from "../components/main/Quickies";
import EndLinks from "../components/main/EndLinks";

function Home() {
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
