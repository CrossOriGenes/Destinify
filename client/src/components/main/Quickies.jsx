import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RatingsStar from "../UI/RatingsStar";
import { PlaceCardSkeleton2, PlaceCardSkeleton3 } from "../UI/LoaderSkeletons";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Quickies = () => {
  const fetchedRef1 = useRef(false);
  const fetchedRef2 = useRef(false);
  const [places1, setPlaces1] = useState([]);
  const [places2, setPlaces2] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const mapScrollY = useTransform(
    scrollY,
    [950, 1500, 2000, 2500, 3000, 3200],
    [5, -5, -50, -100, -150, -200]
  );
  async function fetchPlaceSummary1() {
    try {
      setLoading((loading) => !loading);
      const res = await fetch(`${BASE_URL}/places/summaries/s3`);
      const result = await res.json();

      if (res.status === 200) setPlaces1(result.data);
      // console.log(result);
    } catch (err) {
      console.error("Failed to fetch summaries!", err);
      return;
    } finally {
      setLoading(false);
    }
  }
  async function fetchPlaceSummary2() {
    try {
      setLoading((loading) => !loading);
      const res = await fetch(`${BASE_URL}/places/summaries/s4`);
      const result = await res.json();

      if (res.status === 200) setPlaces2(result.data);
    } catch (err) {
      console.error("Failed to fetch summaries!", err);
      return;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!fetchedRef1.current) {
      fetchPlaceSummary1();
      fetchedRef1.current = true;
    }
    if (!fetchedRef2.current) {
      fetchPlaceSummary2();
      fetchedRef2.current = true;
    }
  }, []);

  return (
    <section
      id="quickies"
      className="w-full min-h-screen relative overflow-hidden bg-gray-800"
    >
      <div
        className="absolute bottom-0 left-0 w-full h-[300px] bg-blend-screen z-2"
        style={{ background: "linear-gradient(to top, #030712, transparent)" }}
      />
      <div className="relative w-full">
        <div className="absolute top-20 -left-30 h-[800px] w-[500px] pointer-events-none bg-[url('/images/icon-group-1.png')] bg-cover bg-center opacity-10 float-animate" />
        <div className="absolute w-[40%] h-screen top-0 right-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            src="https://res.cloudinary.com/dtfoedy3u/video/upload/v1755059125/travel_bg_lg7fhx.mp4"
            className="absolute top-0 right-0 w-full h-full object-cover rounded-l-[50px]"
          />
        </div>
        <div className="relative w-[60%] xl:p-[140px] py-28 px-20 text-white">
          <motion.div
            className="absolute top-[27%] -right-50 xl:w-[550px] xl:h-99 w-[400px] h-80 bg-[url('/images/india-map.png')] bg-cover bg-center pointer-events-none z-2"
            style={{ y: mapScrollY }}
          />
          <h1
            className="font-extrabold text-6xl capitalize z-3"
            data-aos="fade-right"
          >
            Explore places of <span className="text-indigo-500">India</span>
          </h1>
          <p
            className="relative font-medium text-md text-gray-400 leading-5 xl:w-[550px] w-[480px] text-wrap mt-6 z-3"
            data-aos="fade-in"
          >
            At Destinify, we believe that travel is not just about reaching
            destinations -- its about the stories you create along the way.
            Whether you're hiking through the snowy trails of the Himalayas,
            thriving through the dense rainforests in the mid-America or
            exploring the spiritual richness of India, we suggest journeys that
            speak to the soull. Our expert-curated itineries are made for every
            kind of traveler.
          </p>
          <div className="mt-12" data-aos="fade-up">
            <button className="btn-dark w-45 z-3">
              <span className="font-bold text-sm uppercase tracking-wide text-white">
                View More
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="relative w-full xl:p-[140px] py-40 px-20 mt-20">
        <div className="place-items-center text-white">
          <h1
            className="font-extrabold capitalize text-6xl pb-3"
            data-aos="fade-up"
          >
            Explore the <span className="text-indigo-500">spirit of India</span>
          </h1>
          <p
            className="xl:w-4xl md:w-2xl w-3xs py-2 text-center text-md text-gray-300 text-wrap pb-2"
            data-aos="fade-in"
          >
            At Destinify, your adventure begins with the moment you dream it --
            and we're with you all the way, turning that dream into a journey
            worth remembering.
          </p>
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 my-12 mx-10">
          {loading && (
            <>
              <PlaceCardSkeleton2 />
              <PlaceCardSkeleton2 />
              <PlaceCardSkeleton2 />
              <PlaceCardSkeleton2 />
              <PlaceCardSkeleton2 />
              <PlaceCardSkeleton2 />
            </>
          )}
          {!loading &&
            places1.map((place, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.15,
                }}
                viewport={{ once: true }}
                className="card relative group rounded-3xl h-[250px] py-4 px-5 shadow-lg cursor-pointer select-none overflow-clip hover:shadow-xl hover:shadow-gray-500 hover:scale-105 hover:rotate-1 transition duration-300"
                onClick={() => navigate(`/places?place=${place.place_name}`)}
              >
                <div
                  className="absolute bottom-0 left-0 w-full h-[200px] bg-blend-screen z-1"
                  style={{
                    background: "linear-gradient(to top, #000, transparent)",
                  }}
                />
                <img
                  src={place.pic}
                  alt={place.place_name}
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-120 transition-transform duration-300"
                />
                <div className="w-full h-full relative flex items-end justify-between text-white z-2 opacity-90">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-1">
                      <RatingsStar
                        value={place.rating_val}
                        style={{ maxWidth: 85 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-2xl">
                        {place.place_name}
                      </h3>
                      <span className="text-sm font-medium text-indigo-100">
                        {place.subtitle}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {place.description}
                    </p>
                  </div>
                  <div className="w-[25px] h-[25px] flex items-center justify-center rounded-full border-2 border-indigo-400">
                    <i className="fa fa-arrow-right text-sm text-indigo-400 rotate-45 transition duration-300 group-hover:rotate-0" />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        <div className="relative mt-30">
          <h1 className="text-white pt-10" data-aos="fade-left">
            Want some <span className="text-indigo-500">fresh air</span>?
          </h1>
          <p className="text-gray-400 mt-3 mb-20 text-lg" data-aos="fade-up">
            Our mission is to make meaningful travel accessible, safe, and
            unforgettable. We bring together years of travel experience, global
            knowledge, and a passion for creating memories that last a lifetime.
            Whether you're plannig a solo adventure, a romantic gateway or a
            family holiday, we're here to guide you from inspiration to boooking
            and beyond. Browser through hand-picked destinations, read real
            travel stories, and choose from curated packages that go beyond the
            usual. Here we present you the top-3 selected hill-stations, to enjoy
            the best of your trips be it either of a short or a long one...
          </p>
          <div className="grid xl:grid-cols-3 grid-cols-1 gap-8 my-9">
            {loading && (
              <>
                <PlaceCardSkeleton3 />
                <PlaceCardSkeleton3 />
                <PlaceCardSkeleton3 />
              </>
            )}
            {!loading &&
              places2.map((place, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.3,
                  }}
                  viewport={{ once: true }}
                  className="card relative group rounded-3xl h-[500px] py-4 px-5 shadow-lg cursor-pointer select-none overflow-clip hover:shadow-xl hover:shadow-gray-500 hover:scale-105 hover:rotate-1 transition duration-300"
                  onClick={() => navigate(`/places?place=${place.place_name}`)}
                >
                  <div
                    className="absolute bottom-0 left-0 w-full h-[200px] bg-blend-screen z-1"
                    style={{
                      background: "linear-gradient(to top, #000, transparent)",
                    }}
                  />
                  <img
                    src={place.pic}
                    alt={place.place_name}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-120 transition-transform duration-300"
                  />
                  <div className="w-full h-full relative flex items-end justify-between text-white z-2 opacity-90">
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center gap-1">
                        <RatingsStar
                          value={place.rating_val}
                          style={{ maxWidth: 85 }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-2xl">
                          {place.place_name}
                        </h3>
                        <span className="text-sm font-medium text-indigo-100">
                          {place.subtitle}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-400 w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {place.description}
                      </p>
                    </div>
                    <div className="w-[25px] h-[25px] flex items-center justify-center rounded-full border-2 border-indigo-400">
                      <i className="fa fa-arrow-right text-sm text-indigo-400 rotate-45 transition duration-300 group-hover:rotate-0" />
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quickies;
