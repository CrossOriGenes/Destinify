import MainSection from "../components/main/MainSection";
import FormSection from "../components/main/FormSection";
import Header from "../components/UI/Header";

function Home() {
  return (
    <>
      <Header />
      <main>
        <MainSection />
        <FormSection />
      </main>
    </>
  );
}

export default Home;
