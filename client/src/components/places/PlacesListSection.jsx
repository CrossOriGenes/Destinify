import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import RatingsStar from "../UI/RatingsStar";
import CheckBox from "../UI/CheckBox";

const PLACES = [
  {
    place_name: "Udaipur",
    pic: "/images/Udaipur.jpg",
    subtitle: "(20+ Best visiting Place)",
    description: "Romantic lakes & regal palaces.",
    rating_val: 4,
  },
  {
    place_name: "Odisha",
    pic: "/images/Odisha.jpg",
    subtitle: "(10+ Best visiting Place)",
    description: "Spiritual vibes & historic treasures.",
    rating_val: 4.5,
  },
  {
    place_name: "Punjab",
    pic: "/images/Punjab.jpg",
    subtitle: "(15+ Best visiting Place)",
    description: "Where tradition meets vibrant hospitality.",
    rating_val: 4,
  },
  {
    place_name: "Goa",
    pic: "/images/Goa.jpg",
    subtitle: "(5+ Best visiting Place)",
    description: "Sun, sand & soul soothing vibes.",
    rating_val: 3.5,
  },
  {
    place_name: "Sikkim",
    pic: "/images/Sikkim.jpg",
    subtitle: "(10+ Best visiting Place)",
    description: "Serenity in every snow-capped peak.",
    rating_val: 5,
  },
  {
    place_name: "Kerala",
    pic: "/images/Kerala.jpg",
    subtitle: "(20+ Best visiting Place)",
    description: "The beauty of the God's-own country.",
    rating_val: 4.5,
  },
  {
    place_name: "Manali",
    pic: "/images/Manali.jpg",
    subtitle: "(20+ Best visiting Place)",
    description: "Snowy escapes in Himachal Pradesh.",
    rating_val: 4,
  },
  {
    place_name: "Leh",
    pic: "/images/Leh.jpg",
    subtitle: "(30+ Best visiting Place)",
    description: "Cozy heaven of Earth.",
    rating_val: 4.5,
  },
  {
    place_name: "Everest",
    pic: "/images/Himalayas.jpg",
    subtitle: "(10+ Best visiting Place)",
    description: "Where the Earth touches the sky.",
    rating_val: 3,
  },
];

const PlacesListSection = () => {
  const { state } = useLocation();
  const [displayText, setDisplayText] = useState("");
  const fullText = `Your journey starts on ${state?.journey_date}, 
  returns on ${state?.return_date}.
  ${state?.description ? "Note: " + state.description : ""}`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 40); // speed adjust
    return () => clearInterval(interval);
  }, [fullText]);
  function filterByPlaceHandler(place) {
    console.log(place);
  }
  return (
    <section className="w-full min-h-screen bg-gray-800 overflow-hidden">
      <SearchBar onSubmit={filterByPlaceHandler} />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 my-6 p-6">
          <div className="w-full h-[300px] border-2 border-indigo-500 rounded-2xl mt-2 ml-2 p-4 bg-indigo-950 text-gray-200 flex flex-col">
            <h5 className="text-sm font-light mb-1">
              <span className="font-bold">Journey-date: &nbsp;</span>
              {state.journey_date}
            </h5>
            <h5 className="text-sm font-light mb-1">
              <span className="font-bold">Return-date: &nbsp;</span>
              {state.return_date}
            </h5>
            <p className="font-light text-sm text-justify leading-4.5 overflow-ellipsis">
              {state?.description ?? ""}
            </p>
            {/* <span className="animate-pulse">|</span> */}
          </div>
          <div className="ml-2 mt-10">
            <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
              Categories
            </h5>
            <div className="grid xl:grid-cols-2 grid-cols-1 gap-2 mt-3 select-none">
              <CheckBox id="category-1" label="Road Trip" checked={true} />
              <CheckBox id="category-2" label="Festivals" checked={true} />
              <CheckBox id="category-3" label="Beaches" checked={true} />
              <CheckBox id="category-4" label="Mountains" checked={true} />
            </div>
          </div>
          <div className="ml-2 mt-10">
            <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
              Filter By
            </h5>
            <div className="grid xl:grid-cols-2 grid-cols-1 gap-2 mt-3 select-none">
              <CheckBox id="filter-1" label="Ratings" checked={false} />
              <CheckBox id="filter-2" label="Budget" checked={true} />
              <div className="col-span-2">
                <input type="range" id="budget-slider" className="w-full" />
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 my-12 px-6">
          <h3 className="font-extrabold text-4xl text-white mb-6">
            Your <span className="text-indigo-500">Suggestions</span>{" "}
          </h3>
          <div className="space-y-6">
            {PLACES.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.15,
                }}
                viewport={{ once: true }}
                className="card relative group rounded-3xl h-[200px] py-4 px-5 shadow-lg cursor-pointer overflow-clip hover:shadow-xl hover:shadow-gray-500 hover:scale-101 hover:rotate-1 transition duration-300"
              >
                <div
                  className="absolute bottom-0 left-0 w-full h-[200px] bg-blend-screen z-1"
                  style={{
                    background: "linear-gradient(to top, #000, transparent)",
                  }}
                />
                <img
                  src={p.pic}
                  alt={p.place_name}
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-120 transition-transform duration-300"
                />
                <div className="w-full h-full relative flex items-end justify-between text-white z-2 opacity-90">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-1">
                      <RatingsStar
                        value={p.rating_val}
                        style={{ maxWidth: 85 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-2xl">
                        {p.place_name}
                      </h3>
                      <span className="text-sm font-medium text-indigo-100">
                        {p.subtitle}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-400">
                      {p.description}
                    </p>
                  </div>
                  <div className="w-[25px] h-[25px] flex items-center justify-center rounded-full border-2 border-indigo-400">
                    <i className="fa fa-arrow-right text-sm text-indigo-400 rotate-45 transition duration-300 group-hover:rotate-0" />
                  </div>
                </div>
              </motion.div>
            ))}
            <div
              className="w-full h-[200px] group flex justify-center items-center border-4 border-dashed border-cyan-500 rounded-3xl text-2xl hover:bg-cyan-800 hover:border-cyan-800 !transition !duration-300 cursor-pointer"
              data-aos="fade-up"
            >
              <span className="text-gray-100 me-2">View More</span>
              <i className="fa-solid fa-arrow-down text-indigo-400 text-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacesListSection;
