import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DescriptionSection from "../components/place-details/DescriptionSection";
import HeroSection from "../components/place-details/HeroSection";
import Header from "../components/UI/Header";
import AsideBar from "../components/place-details/AsideBar";
import RatingsReviewSection from "../components/place-details/RatingsReviewSection";
import PlaceImageGallery from "../components/place-details/PlaceImageGallery";

function PlaceDetails() {
  const { pathname } = useLocation();
  const sections = [
    "place-descr-intro",
    "ratings",
    "place-img-gallery",
    "festivals",
    "estim-budget",
  ];
  const [activeLink, setActiveLink] = useState(sections[0]);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      // setFixedTabContents(scrollY > 670);

      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop - 100;
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="grid grid-cols-1 xl:grid-cols-4">
        <HeroSection />
        <AsideBar activeLink={activeLink} setActiveLink={setActiveLink} />
        <DescriptionSection />
        <RatingsReviewSection />
        <PlaceImageGallery />
      </main>
    </>
  );
}

export default PlaceDetails;
