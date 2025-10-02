import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import DescriptionSection from "../components/place-details/DescriptionSection";
import HeroSection from "../components/place-details/HeroSection";
import Header from "../components/UI/Header";
import LoaderBackdrop from "../components/UI/LoaderBackdrop";
import AsideBar from "../components/place-details/AsideBar";
import RatingsReviewSection from "../components/place-details/RatingsReviewSection";
import PlaceImageGallery from "../components/place-details/PlaceImageGallery";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PlaceDetails() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const sections = [
    "place-descr-intro",
    "ratings",
    "place-img-gallery",
    "festivals",
    "estim-budget",
  ];
  const [activeLink, setActiveLink] = useState(sections[0]);
  const fetchedRef = useRef(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({});

  async function fetchPlaceData() {
    // console.log(id);
    try {
      setLoad(true);
      const res = await fetch(`${BASE_URL}/places?id=${id}`);
      const result = await res.json();
      if (res.status === 404) {
        toast.error(
          <p className="font-semibold text-[11px]">{result.errMsg}</p>
        );
        return;
      }
      // console.log(result.data);
      setData(result.data || {});
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to fetch data!</p>
      );
      console.error("Something went wrong, try again later!", err);
    } finally {
      setLoad(false);
    }
  }

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
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchPlaceData();
      fetchedRef.current = true;
    }
  }, []);

  return (
    <>
      <Header />
      <main className="grid grid-cols-1 xl:grid-cols-4">
        <HeroSection data={data} />
        <AsideBar activeLink={activeLink} setActiveLink={setActiveLink} />
        <DescriptionSection data={data} />
        <RatingsReviewSection data={data} />
        <PlaceImageGallery data={data} />
      </main>

      <AnimatePresence>{load && <LoaderBackdrop />}</AnimatePresence>
    </>
  );
}

export default PlaceDetails;
