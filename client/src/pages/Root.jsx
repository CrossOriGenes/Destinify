import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hero from "../components/landing/Hero";
import Intro from "../components/landing/Intro";
import QuickSearches from "../components/landing/QuickSearches";
import AboutUs from "../components/landing/About";
import StatsSection from "../components/landing/StatsSection";
import FormSection from "../components/landing/FormSection";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import MainHeader from "../components/landing/MainHeader";

function Root() {
  const sections = ["hero", "about", "suggestion", "testimonial", "newsletter"];
  const [activeLink, setActiveLink] = useState("hero");
  const [fixedHeader, setFixedHeader] = useState(false);
  const [fixedBtn, setFixedBtn] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      setFixedHeader(scrollY > 670);
      setFixedBtn(scrollY > 1340);

      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop - 100; // offset for header height
          const sectionHeight = section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            setActiveLink(id);
            break;
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MainHeader
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        fixedClass={fixedHeader}
      />
      <main>
        <Hero />
        <AboutUs />
        <Intro />
        <QuickSearches />
        <StatsSection />
        <FormSection />
        <Testimonials />
      </main>
      <Footer />

      <div
        className={`${
          fixedBtn ? "fixed" : "hidden"
        } bottom-5 right-5 w-full flex items-center justify-end z-20`}
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", damping: 15, stiffness: 900 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-12 h-12 bg-pink-800 hover:bg-pink-600 rounded-full cursor-pointer transition-colors duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <i className="fa-solid fa-arrow-up text-white text-xl" />
        </motion.button>
      </div>
    </>
  );
}

export default Root;
