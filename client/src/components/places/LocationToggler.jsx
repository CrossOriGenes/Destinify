import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import Modal from "../UI/Modal";

const LocationToggler = ({ onSubmit, onLocSuccess }) => {
  const [open, setOpen] = useState(false);
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
      console.log(position.coords);
      toast.info(
        <p className="text-[11px] font-semibold">Coordinates collected👍🏻</p>
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

export default LocationToggler;
