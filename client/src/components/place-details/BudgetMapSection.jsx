import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useJsApiLoader } from "@react-google-maps/api";
import LocationFinderForm from "./LocationFinderForm";
import RoutesMap from "./RoutesMap";
import Accordion from "../UI/Accordion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BudgetMapSection = ({ data }) => {
  const [openIdx, setOpenIdx] = useState(0);
  const [showLocForm, setShowLocForm] = useState(true);
  const [load, setLoad] = useState(false);
  const [isErr, setErr] = useState(false);
  const [options, setOptions] = useState([]);
  const { state } = useLocation();
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_KEY });

  function getBestTimeText(bestTimeArr) {
    if (!bestTimeArr || bestTimeArr.length === 0)
      return "This place is visitable for any time of the year";
    const t1 = bestTimeArr[0] - 1;
    const t2 = bestTimeArr[bestTimeArr.length - 1] - 1;
    const m1 = MONTHS[t1];
    const m2 = MONTHS[t2];
    return `${m1} - ${m2}, is the ideal time to visit this place keeping the weather-conditions, other factors & festivities in mind.`;
  }
  function getIdealTimeText(isoDate) {
    if (!isoDate) return "This place is visitable for any time of the year";
    const dt = new Date(isoDate);
    const mm = MONTHS[dt.getMonth()];
    return `${mm} is the perfect time for one to get the most enhancements of the city.`;
  }
  const SECTIONS = [
    {
      title: "Best Time to Visit",
      content: getBestTimeText(data?.Best_Time_To_Visit ?? []),
    },
    {
      title: "Ideal Time Period",
      content: getIdealTimeText(data?.Ideal_Duration ?? ""),
    },
    {
      title: "More About the Place",
      content: data.Place_Desc ? data.Place_Desc : data.City_Desc,
    },
    {
      title: "FAQs",
      content: [
        "How to reach this place?",
        "Are there budget hotels nearby?",
        "Is it safe for solo travelers?",
        "Which local dishes are must-try here?",
      ],
    },
  ];
  async function getLocCoordsHandler(address) {
    // console.log(address);
    const address_data =
      state.budget > 0 || state.budget
        ? { ...address, budget: state.budget }
        : address;
    console.log(address_data);
    try {
      setLoad(true);
      const res = await fetch(`${BASE_URL}/places/coords`, {
        method: "POST",
        body: JSON.stringify(address_data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (res.status === 400) {
        toast.error(
          <p className="text-[11px] font-semibold">{result.errMsg}</p>
        );
        console.error("Missing address parameters!");
        return;
      }
      if (res.status === 404) {
        setErr(true);
        toast.error(
          <p className="text-[11px] font-semibold">{result.errMsg}</p>
        );
        console.error(
          `Unable to fetch coordinates for the place '${state.Place}'!`
        );
        return;
      }
      console.log(result);
      setOptions(result.route_options);
      setErr(false);
      setShowLocForm(false);
    } catch (e) {
      toast.error(
        <p className="text-[11px] font-semibold">
          Failed to fetch coordinates!
        </p>
      );
      console.error("Something went wrong, try again later!", e);
      return;
    } finally {
      setLoad(false);
    }
  }
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);
  return (
    <section
      id="estim-budget"
      className="relative col-span-4 xl:p-[120px] p-[70px] min-h-screen bg-gray-900 overflow-hidden"
    >
      <div className="absolute top-5 -right-5 w-[360px] h-[700px] bg-[url('/images/icon-group-1.png')] bg-cover bg-center opacity-10 float-animate" />
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-left lg:text-6xl text-4xl font-extrabold text-wrap text-white lg:leading-15 leading-10 mr-8">
          Budget & <span className="text-indigo-500">Best paths</span>
        </h2>
        <div className="relative flex flex-col items-end justify-end">
          <p className="text-right text-gray-500 font-medium lg:text-lg text-sm">
            Enjoying out to the fullest possible is actually the main aim of any
            trip. So from destinify we give you the best optimized routes that
            covers both your budget & trip duration.
            <br /> Enter your source city and state to get the most
            budget-friendly paths available...
          </p>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-3 mt-20">
        <div className="relative lg:w-[50%] w-full h-120 my-6 lg:mx-12 mx-0 rounded-3xl shadow-lg z-2 bg-gray-700 overflow-clip">
          {!options && !isLoaded && (
            <div className="relative w-full h-full select-none">
              <img
                src="/images/map-vector.jpg"
                alt=""
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center -z-1"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                {load && (
                  <span className="text-2xl font-bold text-white z-3 captialize">
                    Getting best routes...
                  </span>
                )}
              </div>
              <div className="flex flex-col h-full justify-between p-4">
                <div className="w-[90px] h-[35px] bg-cyan-950 flex items-center justify-center rounded-3xl text-white font-semibold z-1">
                  Map
                </div>
                <div className="flex flex-col items-end z-1">
                  <div className="w-8 h-16 bg-white rounded-md shadow-lg mb-4 flex flex-col">
                    <div className="w-full h-[50%] flex justify-center items-center border-b-1 border-gray-300">
                      <i className="fa-solid fa-plus" />
                    </div>
                    <div className="w-full h-[50%] flex justify-center items-center">
                      <i className="fa-solid fa-minus" />
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-cyan-950 rounded-full flex justify-center items-center">
                    <i className="fa-solid fa-paper-plane text-white text-xs" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {options && isLoaded && <RoutesMap routesData={options} />}
        </div>
        <div className="lg:w-[50%] w-full my-6 lg:mx-6 mx-0 z-2">
          {showLocForm && (
            <div className="w-full flex justify-center mt-12">
              <LocationFinderForm
                loading={load}
                isErr={isErr}
                onSubmit={getLocCoordsHandler}
                destination={`${state?.Place ?? ""}, ${
                  state?.City ?? ""
                }, India`}
              />
            </div>
          )}
          {!showLocForm && (
            <>
              <h3
                className="text-4xl text-indigo-100 font-extrabold mt-8"
                data-aos="fade-in"
              >
                Estimations 💰
              </h3>
              {options.length > 0 ? (
                <>
                  <table
                    className="w-full border-collapse mt-4"
                    data-aos="fade-down"
                  >
                    <thead>
                      <tr className="bg-cyan-800 border-y-3 border-white uppercase">
                        <th className="font-extrabold text-cyan-100 p-3">
                          Mode
                        </th>
                        <th className="font-extrabold text-cyan-100 p-3">
                          Distance
                        </th>
                        <th className="font-extrabold text-cyan-100 p-3">
                          Duration
                        </th>
                        <th className="font-extrabold text-cyan-100 p-3">
                          Cost (₹)
                        </th>
                        {state.budget && (
                          <th className="font-extrabold text-cyan-100 p-3">
                            Within Budget
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {options.map((opt, idx) => (
                        <tr
                          key={idx}
                          className="nth-of-type-[odd]:bg-gray-800 border-b-1 border-gray-400 text-center"
                        >
                          <td className="text-sm font-medium text-gray-300 py-2 px-4">
                            {opt.mode}
                          </td>
                          <td className="text-sm font-medium text-gray-300 py-2 px-4">
                            {opt.distance}
                          </td>
                          <td className="text-sm font-medium text-gray-300 py-2 px-4">
                            {opt.duration}
                          </td>
                          <td className="text-sm font-medium text-gray-300 py-2 px-4">
                            {opt.estimated_cost}
                          </td>
                          {(state.budget || state.budget > 0) && (
                            <td className="text-sm font-medium text-gray-300 py-2 px-4">
                              {opt.within_budget ? (
                                <i className="fa-solid fa-check text-green-600" />
                              ) : (
                                <i className="fa-solid fa-xmark text-red-600" />
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="font-medium text-xs text-red-400 mt-1.5 tracking-wide">
                    *All the rates shown are limited to 1 person/day.
                  </p>
                </>
              ) : (
                <div className="w-full flex justify-center mt-6">
                  <p className="text-xl font-medium text-amber-400">
                    Sorry, No matching paths found! 😢
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-3 mt-25">
        <div className="relative lg:w-[50%] w-full my-6 lg:mx-6 mx-0 px-4">
          <h3
            className="text-5xl font-extrabold text-white capitalize px-2 mt-3"
            data-aos="fade-up"
          >
            Discover the best{" "}
            <span className="text-indigo-500">time to visit</span>
          </h3>
          <p
            className="font-medium text-gray-600 text-lg leading-6 mt-4 px-2"
            data-aos="fade-in"
          >
            {`Explore ${
              data?.Place ?? "this destination"
            } at its finest. Experience its natural beauty, cultural vibes, and vibrant atmosphere when the weather and local festivities align perfectly for travel.`}
          </p>
        </div>
        <div className="relative lg:w-[50%] w-full min-h-96 my-6 lg:mx-6 mx-0 px-4">
          <div
            className="w-full max-w-3xl mx-4 mt-8 border-1 border-gray-700 rounded-3xl overflow-clip"
            data-aos="fade-left"
          >
            {SECTIONS.map((sec, i) => (
              <Accordion
                key={i}
                title={sec.title}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              >
                {Array.isArray(sec.content) ? (
                  <ul className="list-disc pl-6 pt-3 space-y-1">
                    {sec.content.map((q, j) => (
                      <li
                        key={j}
                        className="font-medium text-gray-500 leading-5"
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-medium text-gray-500 pt-3 leading-5">
                    {sec.content}
                  </p>
                )}
              </Accordion>
            ))}
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-[100px] bg-blend-screen z-3"
        style={{ background: "linear-gradient(to top, #030712, transparent)" }}
      />
    </section>
  );
};

export default BudgetMapSection;
