import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import SearchBar from "./LocationToggler";
import { PlaceCardSkeleton } from "../UI/LoaderSkeletons";
import RatingsStar from "../UI/RatingsStar";
import FilterListForm from "./FilterListForm";
import LoaderBackdrop from "../UI/LoaderBackdrop";
import Modal from "../UI/Modal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const PLACES = [
//   {
//     _id: "001",
//     place_name: "Udaipur",
//     pic: "/images/Udaipur.jpg",
//     subtitle: "(20+ Best visiting Place)",
//     description: "Romantic lakes & regal palaces.",
//     rating_val: 4,
//   },
//   {
//     _id: "002",
//     place_name: "Odisha",
//     pic: "/images/Odisha.jpg",
//     subtitle: "(10+ Best visiting Place)",
//     description: "Spiritual vibes & historic treasures.",
//     rating_val: 4.5,
//   },
//   {
//     _id: "003",
//     place_name: "Punjab",
//     pic: "/images/Punjab.jpg",
//     subtitle: "(15+ Best visiting Place)",
//     description: "Where tradition meets vibrant hospitality.",
//     rating_val: 4,
//   },
//   {
//     _id: "004",
//     place_name: "Goa",
//     pic: "/images/Goa.jpg",
//     subtitle: "(5+ Best visiting Place)",
//     description: "Sun, sand & soul soothing vibes.",
//     rating_val: 3.5,
//   },
//   {
//     _id: "005",
//     place_name: "Sikkim",
//     pic: "/images/Sikkim.jpg",
//     subtitle: "(10+ Best visiting Place)",
//     description: "Serenity in every snow-capped peak.",
//     rating_val: 5,
//   },
//   {
//     _id: "006",
//     place_name: "Kerala",
//     pic: "/images/Kerala.jpg",
//     subtitle: "(20+ Best visiting Place)",
//     description: "The beauty of the God's-own country.",
//     rating_val: 4.5,
//   },
//   {
//     _id: "007",
//     place_name: "Manali",
//     pic: "/images/Manali.jpg",
//     subtitle: "(20+ Best visiting Place)",
//     description: "Snowy escapes in Himachal Pradesh.",
//     rating_val: 4,
//   },
//   {
//     _id: "008",
//     place_name: "Leh",
//     pic: "/images/Leh.jpg",
//     subtitle: "(30+ Best visiting Place)",
//     description: "Cozy heaven of Earth.",
//     rating_val: 4.5,
//   },
//   {
//     _id: "009",
//     place_name: "Everest",
//     pic: "/images/Himalayas.jpg",
//     subtitle: "(10+ Best visiting Place)",
//     description: "Where the Earth touches the sky.",
//     rating_val: 3,
//   },
// ];

const PlacesListSection = () => {
  const fetchedRef = useRef(false);
  const [loading, setLoading] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [cnt, setCnt] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [places, setPlaces] = useState([]);
  const { state, search } = useLocation();
  const query = new URLSearchParams(search);
  const category = query.get("category");
  const place = query.get("place");
  const journeyData = state;
  const navigate = useNavigate();

  function filterByPlaceHandler(place) {
    console.log(place);
  }
  function filterByPropsHandler(filters) {
    console.log("Filters Applied:", filters);
  }
  async function fetchPlacesByCategory(page) {
    try {
      console.log(page);
      if (page > 1) window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(page === 1 ? "overlay" : "skeleton");
      const response = await fetch(
        `${BASE_URL}/places/category/${category}?count-request=${page}`
      );
      const result = await response.json();
      if (response.status === 200) {
        setPlaces((prev) => {
          if (page === 1) return result.places;
          const temp = [...prev, ...result.places];
          const uniquePlaces = [
            ...new Map(temp.map((item) => [item.Place, item])).values(),
          ];
          // console.log(uniquePlaces);
          return uniquePlaces;
        });
        if (page === 1) {
          toast.success(
            <p className="text-[12.5px] font-semibold">{result.msg}</p>
          );
          setTotalRecords(result.total);
        }
        console.log(result);
        return;
      }
      if (response.status === 403) {
        setMsg(result.infoMsg);
        toast.warning("You're out of limit!");
        setOpen(true);
        return;
      }
      if (response.status === 400) {
        toast.error(result.errMsg);
        return;
      }
    } catch (e) {
      toast.error("Sorry, Something went wrong!😢");
      console.log(e);
    } finally {
      setLoading("");
    }
  }
  async function fetchPlacesByName(page) {
    try {
      console.log(page);
      if (page > 1) window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(page === 1 ? "overlay" : "skeleton");
      const response = await fetch(
        `${BASE_URL}/places/place/${place}?count-request=${page}`
      );
      const result = await response.json();
      if (response.status === 200) {
        setPlaces((prev) => {
          if (page === 1) return result.places;
          const temp = [...prev, ...result.places];
          const uniquePlaces = [
            ...new Map(temp.map((item) => [item.Place, item])).values(),
          ];
          // console.log(uniquePlaces);
          return uniquePlaces;
        });
        if (page === 1) {
          toast.success(
            <p className="text-[12.5px] font-semibold">{result.msg}</p>
          );
          setTotalRecords(result.total);
        }
        console.log(result);
        return;
      }
      if (response.status === 403) {
        setMsg(result.infoMsg);
        toast.warning("You're out of limit!");
        setOpen(true);
        return;
      }
      if (response.status === 400) {
        toast.error(result.errMsg);
        return;
      }
    } catch (e) {
      toast.error("Sorry, Something went wrong!😢");
      console.log(e);
    } finally {
      setLoading("");
    }
  }
  async function fetchRecommendations() {
    const { journey_date, return_date, days, destination, budget } = state;
    const journeyData = {
      journey_date,
      return_date,
      days,
      destination,
      budget,
    };
    // console.log(journeyData)
    try {
      setLoading("overlay");
      const response = await fetch(`${BASE_URL}/places/recommend`, {
        method: "POST",
        body: JSON.stringify(journeyData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status === 200) {
        setPlaces(result.places);
        toast.success(
          <p className="text-[12.5px] font-semibold">{result.msg}</p>
        );
        console.log(result);
        return;
      }
      if (response.status === 400) {
        toast.error(
          <p className="text-[11px] font-semibold">{result.errMsg}</p>
        );
        return;
      }
    } catch (e) {
      toast.error(
        <p className="text-[11px] font-semibold">
          Sorry, Something went wrong!😢
        </p>
      );
      console.log(e);
    } finally {
      setLoading("");
    }
  }
  function addMorePlacesHandler(payload) {
    setCnt((prev) => {
      const next = prev + 1;
      if (payload === "categ") {
        fetchPlacesByCategory(next);
      } else if (payload === "place") {
        fetchPlacesByName(next);
      } else if (payload === "recom") {
        fetchRecommendations(next);
      } else {
        return null;
      }
      return next;
    });
    // console.log(cnt);
  }

  useEffect(() => {
    if (!fetchedRef.current && category && places.length === 0) {
      fetchPlacesByCategory(cnt);
      fetchedRef.current = true;
      // console.log(category);
    }
    if (!fetchedRef.current && place && places.length === 0) {
      fetchPlacesByName(cnt);
      fetchedRef.current = true;
      // console.log(place);
    }
    if (!fetchedRef.current && state && places.length === 0) {
      fetchRecommendations();
      fetchedRef.current = true;
      // console.log(state);
    }
    // console.log(cnt);
  }, []);

  return (
    <>
      <section className="relative w-full min-h-screen bg-gray-900 overflow-hidden">
        {loading === "overlay" && <LoaderBackdrop />}
        {!loading && (
          <div className="relative mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <aside className="lg:col-span-1 my-6 p-6 border-r-1 border-gray-700">
                <form className="relative w-full mt-14 ml-2">
                  <input
                    type="text"
                    id="search-by-loc"
                    className="w-full outline-none border-3 border-gray-600 focus:ring-4 ring-gray-500 py-2 px-4 rounded-lg text-[17px] font-medium text-zinc-200 placeholder:text-zinc-700 transition duration-300"
                    placeholder="Filter by place preferences..."
                  />
                  <div className="absolute top-[5px] right-[5px]">
                    <motion.button
                      whileTap={{ scale: 0.7 }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 500,
                      }}
                      className="w-9 h-9 bg-pink-700 hover:bg-pink-500 rounded-sm place-items-center cursor-pointer transition duration-300"
                    >
                      <i className="fa-solid fa-filter text-white" />
                    </motion.button>
                  </div>
                </form>
                {state && (
                  <div className="w-full h-[300px] border-2 border-indigo-500 rounded-2xl mt-6 ml-2 p-4 bg-indigo-950 text-gray-200 flex flex-col overflow-hidden">
                    <h5
                      className="text-sm font-light mb-1"
                      data-aos="fade-left"
                      data-aos-delay={100}
                    >
                      <span className="font-bold text-indigo-200">
                        Journey-date: &nbsp;
                      </span>
                      {journeyData?.j_dt ?? "N.A."}
                    </h5>
                    <h5
                      className="text-sm font-light mb-1"
                      data-aos="fade-left"
                      data-aos-delay={200}
                    >
                      <span className="font-bold text-indigo-200">
                        Return-date: &nbsp;
                      </span>
                      {journeyData?.re_dt ?? "N.A."}
                    </h5>
                    <h5
                      className="text-sm font-light mb-1"
                      data-aos="fade-left"
                      data-aos-delay={300}
                    >
                      <span className="font-bold text-indigo-200">
                        Total-duration: &nbsp;
                      </span>
                      {journeyData.days ? `${journeyData.days} day(s)` : "N.A."}
                    </h5>
                    <h5
                      className="text-sm font-light mb-1"
                      data-aos="fade-left"
                      data-aos-delay={300}
                    >
                      <span className="font-bold text-indigo-200">
                        Destination: &nbsp;
                      </span>
                      {journeyData?.destination ?? "N.A."}
                    </h5>
                    <h5
                      className="text-sm font-light mb-1"
                      data-aos="fade-left"
                      data-aos-delay={300}
                    >
                      <span className="font-bold text-indigo-200">
                        Budget: &nbsp;
                      </span>
                      {journeyData.budget ? `₹ ${journeyData.budget}` : "--"}
                    </h5>
                  </div>
                )}
                <FilterListForm
                  onFilter={filterByPropsHandler}
                  prompt={state ? true : false}
                />
              </aside>

              <div className="lg:col-span-3 px-6 mt-12 mb-48">
                <h3 className="font-extrabold text-5xl text-white mb-10">
                  Your <span className="text-indigo-500">Suggestions</span>{" "}
                </h3>
                <div className="space-y-6">
                  {loading === "skeleton" ? (
                    <>
                      <PlaceCardSkeleton />
                      <PlaceCardSkeleton />
                      <PlaceCardSkeleton />
                      <PlaceCardSkeleton />
                    </>
                  ) : (
                    <>
                      {places.map((p, idx) => (
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
                          onClick={() => navigate(p._id)}
                        >
                          <div
                            className="absolute bottom-0 left-0 w-full h-[200px] bg-blend-screen z-1"
                            style={{
                              background:
                                "linear-gradient(to top, #000, transparent)",
                            }}
                          />
                          <img
                            src={p.Place_images[0]}
                            alt={p.place_name}
                            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-120 transition-transform duration-300"
                          />
                          <div className="w-full h-full relative flex items-end justify-between text-white z-2 opacity-90">
                            <div className="flex flex-col">
                              {p.Place_Rating > 0.0 && (
                                <div className="flex flex-row items-center gap-1">
                                  <RatingsStar
                                    value={p.Place_Rating}
                                    style={{ maxWidth: 85 }}
                                  />
                                </div>
                              )}
                              <h3 className="font-extrabold text-2xl">
                                {p.Place}
                              </h3>
                              <div className="flex items-center my-1.5 text-indigo-200">
                                <i className="fa-solid fa-location-dot text-xs" />
                                <span className="text-xs font-medium ml-0.5">
                                  {p.City}
                                </span>
                              </div>
                              <p className="relative text-xs font-medium text-gray-400 w-[350px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {p.Place_Desc}
                              </p>
                            </div>
                            <div className="w-[25px] h-[25px] flex items-center justify-center rounded-full border-2 border-indigo-400">
                              <i className="fa fa-arrow-right text-sm text-indigo-400 rotate-45 transition duration-300 group-hover:rotate-0" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {totalRecords > 25 && (
                        <div
                          className="w-full h-[200px] group flex justify-center items-center border-4 border-dashed border-cyan-500 rounded-3xl text-2xl hover:bg-cyan-800 hover:border-cyan-800 !transition !duration-300 cursor-pointer"
                          data-aos="fade-up"
                          onClick={() => {
                            addMorePlacesHandler(
                              category
                                ? "categ"
                                : place
                                ? "place"
                                : state
                                ? "recom"
                                : ""
                            );
                          }}
                        >
                          <span className="text-gray-100 me-2">View More</span>
                          <i className="fa-solid fa-arrow-down text-indigo-400 text-xl" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 w-full h-[100px] bg-blend-screen z-3"
              style={{
                background: "linear-gradient(to top, #030712, transparent)",
              }}
            />
          </div>
        )}
      </section>

      <AnimatePresence>
        {open && (
          <Modal onClose={() => setOpen(!open)}>
            <header className="flex items-center justify-start bg-pink-700 py-1 px-2 rounded-lg">
              <h2 className="text-2xl text-white font-extrabold capitalize pl-1.5">
                Upgrade to premium
              </h2>
            </header>
            <div className="flex flex-col p-2">
              <p className="text-gray-400 text-md leading-5 mt-2 mb-3">{msg}</p>
              <div className="flex items-end justify-end pt-1.5">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  type="button"
                  className="w-35 h-10 py-2 px-4 me-2 flex items-center justify-center bg-gray-950 border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300 group"
                  onClick={() => navigate("../pricing")}
                >
                  <span className="font-bold text-sm text-white">
                    See Pricing
                  </span>
                  <i className="fa-solid fa-arrow-right text-gray-500 rotate-45 group-hover:rotate-0 transition duration-200 ml-0.5 -me-1" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  type="button"
                  className="w-20 h-10 py-2 px-4 flex items-center justify-center border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300 group"
                  onClick={() => setOpen(!open)}
                >
                  <span className="font-bold text-sm text-gray-950 group-hover:text-white">
                    Cancel
                  </span>
                </motion.button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlacesListSection;
