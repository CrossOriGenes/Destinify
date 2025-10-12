import { useRef } from "react";

const LocationFinderForm = ({ isErr, onSubmit, loading, destination }) => {
  const userLocRef = useRef();
  const destLocRef = useRef();
  function submitFormHandler(e) {
    e.preventDefault();
    if (userLocRef.current.value === "" || destLocRef.current.value === "")
      return;
    const address = {
      source: userLocRef.current.value + ", India",
      destination: destLocRef.current.value,
    };
    onSubmit(address);
  }
  return (
    <form
      autoComplete="off"
      className={`w-[300px] p-5 flex flex-col bg-gray-700 rounded-3xl shadow-md ${
        loading ? "pointer-events-none select-none" : ""
      }`}
      onSubmit={submitFormHandler}
    >
      <div className="relative w-full flex">
        <div className="pl-0 pr-2 py-2 h-full flex flex-col items-center justify-between">
          <div className="w-3 h-3 bg-cyan-500 border-1 border-cyan-300 rounded-full" />
          <div className="relative w-0.5 h-full border-dashed border-2 border-gray-500">
            <div className="absolute w-2.5 h-2.5 bottom-0 -left-1 border-b-3 border-r-3 border-gray-500 rotate-45" />
          </div>
          <div className="w-3 h-3 bg-indigo-500 border-1 border-indigo-300 rounded-full" />
        </div>
        <div className="w-full flex flex-col justify-between gap-3 pl-2.5">
          <div className="w-full flex flex-col mb-1.5">
            <label
              htmlFor="loc-from"
              className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
            >
              Source
            </label>
            <input
              type="text"
              ref={userLocRef}
              id="loc-from"
              className={`outline-none border-2 w-full overflow-hidden text-ellipsis whitespace-nowrap py-1.5 px-3 rounded-3xl focus:ring-3 transition duration-300 text-md text-gray-200 ${
                isErr
                  ? "border-red-500 ring-red-300"
                  : "border-gray-500 ring-teal-300"
              }`}
              placeholder="Place, City, State"
              required
            />
            {isErr && (
              <p className="text-xs text-red-400 mt-1.5 -mb-1 leading-3.5 px-1">
                No location found for this place! Try something else
              </p>
            )}
          </div>
          <div className="w-full flex flex-col">
            <label
              htmlFor="loc-to"
              className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
            >
              Destination
            </label>
            <input
              type="text"
              ref={destLocRef}
              id="loc-to"
              className="outline-none border-2 border-gray-500 w-full overflow-hidden text-ellipsis whitespace-nowrap py-1.5 px-3 rounded-3xl focus:ring-3 ring-teal-300 transition duration-300 text-md text-gray-200"
              placeholder="Place, City, State"
              value={destination}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className={`group btn-dark z-1 w-[150px] cursor-pointer flex items-center justify-center uppercase ${
            loading ? "cursor-not-allowed pointer-events-none bg-gray-800" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <strong className="text-white group-hover:text-gray-950 text-sm tracking-wide transition-colors duration-200">
                Finding...
              </strong>
              <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
            </>
          ) : (
            <strong className="text-white group-hover:text-gray-950 text-sm tracking-wide transition-colors duration-200">
              Find Paths
            </strong>
          )}
        </button>
      </div>
    </form>
  );
};

export default LocationFinderForm;
