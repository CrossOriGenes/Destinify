import { useState, useEffect, useRef } from "react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const PlaceSuggestionForm = ({ onSubmitData }) => {
  const [today, setDate] = useState("");
  const formRef = useRef();
  const journeyDateRef = useRef();
  const returnDateRef = useRef();
  const placeRef = useRef();
  const budgetRef = useRef();
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    const dt = new Date();
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  function submitFormHandler(e) {
    e.preventDefault();
    const journey = new Date(journeyDateRef.current.value);
    const ret = new Date(returnDateRef.current.value);
    if (ret < journey) {
      setErrMsg("Return date can't be before journey date!");
      return;
    }
    if (ret.getDate() === journey.getDate()) {
      setErrMsg("Journey date & Return date can't be same!");
      return;
    }
    const journey_date = `${journey.getFullYear()}-${String(
      journey.getMonth() + 1
    ).padStart(2, "0")}-${String(journey.getDate()).padStart(2, "0")}`;
    const return_date = `${ret.getFullYear()}-${String(
      ret.getMonth() + 1
    ).padStart(2, "0")}-${String(ret.getDate()).padStart(2, "0")}`;
    // console.log("Journey date: ", journey_date);
    // console.log("Return date: ", return_date);
    const j_dt = `${
      MONTHS[journey.getMonth()]
    } ${journey.getDate()}, ${journey.getFullYear()}`;
    const re_dt = `${
      MONTHS[ret.getMonth()]
    } ${ret.getDate()}, ${ret.getFullYear()}`;
    const utc1 = Date.UTC(
      journey.getFullYear(),
      journey.getMonth(),
      journey.getDate()
    );
    const utc2 = Date.UTC(ret.getFullYear(), ret.getMonth(), ret.getDate());
    const timeDiff = Math.abs(utc2 - utc1);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const searchData = {
      journey_date,
      return_date,
      j_dt,
      re_dt,
      days: daysDiff,
      destination: placeRef.current.value,
      budget: Number(budgetRef.current.value),
    };
    setErrMsg(null);
    onSubmitData(searchData);
    formRef.current.reset();
  }

  return (
    <>
      {errMsg && (
        <div className="absolute -top-20 right-24 mt-4 mb-30 place-items-center">
          <div className="bg-red-900 outline-2 outline-red-400 w-[310px] px-4 py-2 rounded-md flex justify-center items-center text-wrap text-sm font-semibold text-red-400">
            {errMsg}
          </div>
        </div>
      )}
      <form
        className="relative ml-12 mt-2"
        ref={formRef}
        autoComplete="off"
        onSubmit={submitFormHandler}
      >
        <div className="flex xl:flex-row flex-col w-full justify-between gap-2">
          <div className="flex flex-col w-full px-2">
            <label
              htmlFor="journey"
              className="pl-3 text-[16px] font-bold text-indigo-200"
            >
              Journey date:
            </label>
            <input
              ref={journeyDateRef}
              type="date"
              id="journey"
              className="bg-white outline-none px-6 py-3 rounded-4xl text-gray-400 font-medium text-lg transition duration-500 border-3 border-white focus:border-cyan-800"
              min={today}
              required
            />
          </div>
          <div className="flex flex-col w-full px-2">
            <label
              htmlFor="return"
              className="pl-3 text-[16px] font-bold text-indigo-200"
            >
              Return date:
            </label>
            <input
              ref={returnDateRef}
              type="date"
              id="return"
              className="bg-white outline-none px-6 py-3 rounded-4xl text-gray-400 font-medium text-lg transition duration-500 border-3 border-white focus:border-cyan-800"
              min={today}
              required
            />
          </div>
        </div>
        <div className="relative px-2 pt-4">
          <input
            ref={placeRef}
            type="text"
            name="place"
            maxLength={100}
            className="w-full bg-white outline-none px-6 py-3 rounded-4xl text-gray-400 font-medium text-lg transition duration-500 border-3 border-white focus:border-cyan-800"
            placeholder="Your place/city preference..."
            required
          />
        </div>
        <div className="relative px-2 pt-4 flex">
          <div className="bg-gray-300 w-[10%] flex items-center justify-center text-gray-800 font-bold text-2xl px-2 rounded-l-4xl">
            &#8377;
          </div>
          <input
            ref={budgetRef}
            type="number"
            name="budget"
            min={2000}
            max={100000}
            className="w-[90%] bg-white outline-none pr-6 pl-3 py-3 rounded-r-4xl text-gray-400 font-medium text-lg transition duration-500 border-3 border-white focus:border-cyan-800"
            placeholder="Minimum budget"
          />
        </div>
        <div className="mt-5 flex justify-end">
          <button className="btn-dark z-3">
            <span className="font-bold text-sm tracking-wider text-white uppercase">
              See places
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default PlaceSuggestionForm;
