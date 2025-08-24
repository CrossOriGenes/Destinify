import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../UI/Modal";
import { toast } from "react-toastify";

const SearchBar = ({ onSubmit, onLocSuccess }) => {
  const searchBarRef = useRef();
  const [open, setOpen] = useState(false);

  function handleSearchPlaceSubmitHandler(e) {
    e.preventDefault();
    onSubmit(searchBarRef.current.value);
  }
  function locationCoordsHandler() {
    if (!navigator.geolocation) {
      setOpen(!open);
      toast.error(
        "Sorry, Geolocation is not supported on your system! Try resetting permissions"
      );
      return;
    }
    const onSuccess = (position) => {
      onLocSuccess(position.coords);
      toast.info(
        <div className="leading-5">
          <strong>
            lat: <em className="font-light">{position.coords.latitude}</em>
          </strong>
          <br />
          <strong>
            lon: <em className="font-light">{position.coords.longitude}</em>
          </strong>
        </div>
      );
    };
    const onFailure = () => {
      toast.error(
        <p className="text-xs text-white">
          Sorry, accessing location permission denied! Reset browser permission
          to re-locate.
        </p>
      );
      console.log("Sorry no positions available!");
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onFailure);

    setOpen(!open);
  }

  return (
    <>
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
            <div
              className="w-15 h-15 flex justify-center items-center p-4 rounded-full group-hover:bg-gray-200 transition duration-300 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <i className="fa-solid fa-location-crosshairs text-3xl text-indigo-400 group-hover:text-pink-600" />
            </div>
            <div className="absolute -top-2 left-15 w-30 h-20 bg-gray-900 p-2 rounded-md z-2 transition duration-500 hidden group-hover:block">
              <div className="absolute w-2.5 h-2.5 top-8 -left-1 bg-gray-900 rotate-45" />
              <p className="text-xs text-white">
                Or, search visitable places within <strong>10m</strong> of your
                current location.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Modal onClose={() => setOpen(!open)}>
            <header className="flex items-center justify-between bg-purple-700 py-1 px-2 rounded-lg">
              <h2 className="text-2xl text-white font-extrabold pl-1.5">
                Locate?
              </h2>
              <div
                className="flex items-center justify-center p-1 rounded-full cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <i className="fa-solid fa-xmark" />
              </div>
            </header>
            <div className="flex flex-col p-2">
              <p className="text-gray-400 text-lg leading-6 mt-2 mb-3">
                Do you want to allow us access to your current location?
              </p>
              <div className="flex items-end justify-end pt-1.5">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  type="button"
                  className="w-20 h-10 py-2 px-4 me-2 flex items-center justify-center bg-gray-950 border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300"
                  onClick={locationCoordsHandler}
                >
                  <span className="font-bold text-sm text-white">Yes</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  type="button"
                  className="w-20 h-10 py-2 px-4 flex items-center justify-center border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300 group"
                  onClick={() => setOpen(!open)}
                >
                  <span className="font-bold text-sm text-gray-950 group-hover:text-white">
                    No
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

export default SearchBar;
