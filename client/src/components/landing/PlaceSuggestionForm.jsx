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
  const [description, setDescription] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  // const [jdt, setJdt] = useState("");
  // const [redt, setRedt] = useState("");

  useEffect(() => {
    const dt = new Date();
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }
  function submitFormHandler(e) {
    e.preventDefault();
    const journey = new Date(journeyDateRef.current.value);
    const ret = new Date(returnDateRef.current.value);
    if (ret < journey) {
      setErrMsg("Return date can't be before journey date!");
      return;
    }
    const j_dt = new Date(journey);
    const re_dt = new Date(ret);
    const journey_date = `${MONTHS[j_dt.getMonth()]} ${j_dt.getDate()}, ${j_dt.getFullYear()}`;
    const return_date = `${MONTHS[re_dt.getMonth()]} ${re_dt.getDate()}, ${re_dt.getFullYear()}`;
    const utc1 = Date.UTC(j_dt.getFullYear(), j_dt.getMonth(), j_dt.getDate());
    const utc2 = Date.UTC(re_dt.getFullYear(), re_dt.getMonth(), re_dt.getDate());
    const timeDiff = Math.abs(utc2 - utc1);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    const searchData = {
      journey_date,
      return_date,
      days: daysDiff,
      description,
    };
    setErrMsg(null);
    onSubmitData(searchData);
    formRef.current.reset();
    setDescription("");
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
        onSubmit={submitFormHandler}
      >
        <div className="flex xl:flex-row flex-col w-full justify-between gap-2">
          <div className="flex flex-col w-full px-2">
            <label className="pl-3 text-[16px] font-bold text-indigo-200">
              Journey date:
            </label>
            <input
              ref={journeyDateRef}
              type="date"
              name="journey"
              className="bg-white outline-none px-6 py-3 rounded-3xl text-gray-400 font-medium transition duration-500 border-3 border-white focus:border-cyan-800"
              min={today}
              required
            />
          </div>
          <div className="flex flex-col w-full px-2">
            <label className="pl-3 text-[16px] font-bold text-indigo-200">
              Return date:
            </label>
            <input
              ref={returnDateRef}
              type="date"
              name="return"
              className="bg-white outline-none px-6 py-3 rounded-3xl text-gray-400 font-medium transition duration-500 border-3 border-white focus:border-cyan-800"
              min={today}
              required
            />
          </div>
        </div>
        <div className="relative px-2 pt-4">
          <textarea
            name="description"
            maxLength={1000}
            cols={6}
            className="bg-white outline-none px-6 py-3 w-full h-52 rounded-3xl text-gray-400 font-medium transition duration-500 border-3 border-white focus:border-cyan-800 resize-none"
            placeholder="Some descriptions like budget, place preference, others..."
            onChange={handleDescriptionChange}
          />
          <div className="absolute bottom-3 right-6 text-sm font-medium text-gray-600">
            <span>{description.length}/1000</span>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="btn-dark z-3">
            <span className="font-bold text-sm tracking-wider text-white uppercase">
              Get suggestions
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default PlaceSuggestionForm;
