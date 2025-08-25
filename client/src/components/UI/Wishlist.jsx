import { motion, stagger } from "framer-motion";
import Drawer from "./Drawer";
import { RatingHeart } from "./RatingsStar";

const Wishlist = ({ onClose }) => {
  return (
    <Drawer titleHead="Wishlist" onClose={onClose}>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col list-none p-2"
      >
        <li className="w-full flex items-start justify-between py-4 px-1 border-b-1 border-gray-400">
          <img
            src="/images/Kerala.jpg"
            alt=""
            className="w-[90px] h-[80px] bg-cover rounded-md"
          />
          <div className="w-full flex flex-col ml-2.5">
            <h4 className="font-bold text-indigo-200">Place Name</h4>
            <p className="w-[80%] text-xs py-1 text-white truncate">
              Some description about the place goes here.
            </p>
            <RatingHeart value={4} style={{ maxWidth: 80 }} />
            <div className="flex items-center justify-between w-[85%] mt-4 -mb-1.5">
              <button
                type="button"
                className="w-1/2 text-center font-semibold text-sm text-blue-400 hover:text-blue-300 border-r border-gray-500 cursor-pointer transition duration-300"
              >
                View
              </button>
              <button
                type="button"
                className="w-1/2 text-center font-semibold text-sm text-red-400 hover:text-red-300 cursor-pointer transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
        <li className="w-full flex items-start justify-between py-4 px-1 border-b-1 border-gray-400">
          <img
            src="/images/Kerala.jpg"
            alt=""
            className="w-[90px] h-[80px] bg-cover rounded-md"
          />
          <div className="w-full flex flex-col ml-2.5">
            <h4 className="font-bold text-indigo-200">Place Name</h4>
            <p className="w-[80%] text-xs py-1 text-white truncate">
              Some description about the place goes here.
            </p>
            <RatingHeart value={4} style={{ maxWidth: 80 }} />
            <div className="flex items-center justify-between w-[85%] mt-4 -mb-1.5">
              <button
                type="button"
                className="w-1/2 text-center font-semibold text-sm text-blue-400 hover:text-blue-300 border-r border-gray-500 cursor-pointer transition duration-300"
              >
                View
              </button>
              <button
                type="button"
                className="w-1/2 text-center font-semibold text-sm text-red-400 hover:text-red-300 cursor-pointer transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
        <li className="w-full flex items-start justify-between py-4 px-1">
          <img
            src="/images/Kerala.jpg"
            alt=""
            className="w-[90px] h-[80px] bg-cover rounded-md"
          />
          <div className="w-full flex flex-col ml-2.5">
            <h4 className="font-bold text-indigo-200">Place Name</h4>
            <p className="w-[80%] text-xs py-1 text-white truncate">
              Some description about the place goes here.
            </p>
            <RatingHeart value={4.5} style={{ maxWidth: 80 }} />
            <div className="flex items-center justify-between w-[85%] mt-4 -mb-1.5">
              <button
                type="button"
                className="w-1/2 text-center font-semibold text-sm text-blue-400 hover:text-blue-300 border-r border-gray-500 cursor-pointer transition duration-300"
              >
                View
              </button>
              <button
                type="button"
                className="w-1/2 text-center font-semibold text-sm text-red-400 hover:text-red-300 cursor-pointer transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
      </motion.ul>
    </Drawer>
  );
};

export default Wishlist;
