import { useRef } from "react";
import { motion } from "framer-motion";

const SearchBar = ({ onSubmit }) => {
  const searchBarRef = useRef();
  function handleSearchPlaceSubmitHandler(e) {
    e.preventDefault();
    onSubmit(searchBarRef.current.value)
  }
  return (
    <div className="relative w-full h-[12rem] p-[70px] flex justify-center items-center bg-white">
      <div className="w-full flex items-center justify-between gap-[0.5rem] mx-35 -mb-15 z-1">
        <form
          className="relative w-[92%]"
          onSubmit={handleSearchPlaceSubmitHandler}
        >
          <input
            type="text"
            ref={searchBarRef}
            id="search-by-loc"
            className="w-full outline-none border-3 border-gray-600 focus:ring-4 ring-indigo-500 py-4 px-8 rounded-4xl ml-4 text-lg font-semibold text-zinc-700 placeholder:text-zinc-400 transition duration-300"
            maxLength={15}
            minLength={2}
            required
            placeholder="Some place preferences..."
          />
          <div className="absolute top-[5px] -right-2.5">
            <motion.button
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", damping: 15, stiffness: 500 }}
              className="btn2-dark h-[55px] rounded-4xl group"
            >
              <span className="text-white group-hover:text-[#100624] font-semibold">
                Search
              </span>
            </motion.button>  
          </div>
        </form>
        <div className="group relative">
          <div className="w-15 h-15 flex justify-center items-center p-4 rounded-full group-hover:bg-gray-200 transition duration-300 cursor-pointer">
            <i className="fa-solid fa-location-crosshairs text-3xl text-indigo-400 group-hover:text-pink-600" />
          </div>
          <div className="absolute -top-2 left-15 w-30 h-20 bg-gray-900 p-2 rounded-md z-2 transition duration-500 hidden group-hover:block">
            <div className="absolute w-2.5 h-2.5 top-8 -left-1 bg-gray-900 rotate-45" />
            <p className="text-xs text-white z-3">
              Or, search visitable places within <strong>10m</strong> of your
              current location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
