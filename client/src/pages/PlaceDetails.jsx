import { useState, useEffect, useRef, useContext } from "react";
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
import BudgetMapSection from "../components/place-details/BudgetMapSection";
import FestivalSection from "../components/place-details/FestivalSection";
import GotoTopButton from "../components/UI/GotoTopButton";
import EndLinks from "../components/places/EndLinks";
import { AppContext } from "../components/store/AppContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PlaceDetails() {
  const { addPreferredTheme, addSearchedPlaceToList, addToWishlist } =
    useContext(AppContext);
  const { id } = useParams();
  const { pathname } = useLocation();
  const sections = [
    "place-descr-intro",
    "ratings",
    "place-img-gallery",
    "estim-budget",
    "festivals",
  ];
  const [activeLink, setActiveLink] = useState(sections[0]);
  const fetchedRef = useRef(false);
  const [load, setLoad] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [placeData, setPlaceData] = useState({});
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState([]);
  const [imageGallery, setImageGallery] = useState([]);
  const [festivals, setFestivals] = useState([]);

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
      if (result.data) {
        // console.log(result.data);
        const {
          place_data,
          reviews,
          aspect_ratings,
          overall_rating,
          photos,
          festivals,
        } = result.data;
        if (place_data) {
          setPlaceData(place_data);
          addPreferredTheme(place_data.Category[0]);
          addSearchedPlaceToList(place_data.Place);
        }
        if (photos && Array.isArray(photos)) setImageGallery(photos);
        if (reviews && Array.isArray(reviews)) setReviews(reviews);
        if (festivals && Array.isArray(festivals)) setFestivals(festivals);
        if (aspect_ratings) setRatings(aspect_ratings);
        if (overall_rating) setOverallRating(overall_rating);
      }
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to fetch data!</p>
      );
      console.error("Something went wrong, try again later!", err);
    } finally {
      setLoad(false);
    }
  }
  function addPlaceToWishlistHandler() {
    addToWishlist({
      id: placeData._id,
      place: placeData.Place,
      description: placeData.Place_Desc,
      rating: placeData.Place_Rating,
      picture: placeData.Place_images[0],
    });
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
        <HeroSection data={placeData} />
        <AsideBar activeLink={activeLink} setActiveLink={setActiveLink} />
        <DescriptionSection data={placeData} />
        <RatingsReviewSection
          reviews={reviews}
          ratings={ratings}
          overallRating={overallRating}
        />
        <PlaceImageGallery images={imageGallery} />
        <BudgetMapSection data={placeData} />
        <FestivalSection
          festivals={festivals}
          onAddToWishlist={addPlaceToWishlistHandler}
        />
      </main>
      <EndLinks />

      <GotoTopButton />

      <AnimatePresence>{load && <LoaderBackdrop />}</AnimatePresence>
    </>
  );
}

export default PlaceDetails;
