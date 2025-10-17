import { useContext } from "react";
import { motion } from "framer-motion";
import { RatingHeart } from "./RatingsStar";
import Drawer from "./Drawer";
import { AppContext } from "../store/AppContext";

const Wishlist = ({ onClose }) => {
  const { wishlist, token } = useContext(AppContext);
  return (
    <Drawer
      titleText={
        <h1 className="text-4xl font-extrabold text-white ml-1">
          Your <span className="text-indigo-500">Favs</span>
        </h1>
      }
      onClose={onClose}
    >
      {token && !wishlist && (
        <div className="w-full h-full flex items-center justify-center flex-col -mt-10 px-4">
          <h3 className="font-extrabold text-[26px] text-gray-300">
            Wishlist is Empty!😢
          </h3>
          <div className="w-54 h-54 relative bg-[url('/images/empty-bag-fallback.png')] bg-center bg-cover" />
          <p className="font-semibold text-md leading-4.5 text-gray-500">
            Your Favlist bag is empty! Please add some places to Favlist.
          </p>
        </div>
      )}
      {!token && !wishlist && (
        <div className="w-full h-full flex items-center justify-center flex-col -mt-10 px-4">
          <h3 className="font-extrabold text-[26px] text-gray-300">
            Wishlist is Empty!😢
          </h3>
          <div className="w-54 h-54 relative bg-[url('/images/empty-bag-fallback.png')] bg-center bg-cover" />
          <p className="font-semibold text-md leading-4.5 text-gray-500">
            Your Favlist bag is empty! Please login/signup & add some places to
            Favlist.
          </p>
        </div>
      )}
      {wishlist && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col list-none p-2"
        >
          {wishlist.map((item, i) => (
            <li
              className="w-full flex items-start justify-between py-4 px-1 border-b-1 border-gray-400"
              key={item.id}
            >
              <img
                src={item.picture}
                alt=""
                className="w-[90px] h-[80px] bg-cover rounded-md"
              />
              <div className="w-full flex flex-col ml-2.5">
                <h4 className="w-[60%] font-bold text-indigo-200 truncate">
                  {item.place}
                </h4>
                <p className="w-[66%] text-xs py-1 text-white truncate">
                  {item.description}
                </p>
                <RatingHeart value={item.rating} style={{ maxWidth: 80 }} />
                <div className="flex items-center justify-between w-[68%] mt-4 -mb-1.5">
                  <button
                    type="button"
                    className="w-[100px] text-center font-semibold text-sm text-blue-400 hover:text-blue-300 border-r border-gray-500 cursor-pointer transition duration-300"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="w-[100px] text-center font-semibold text-sm text-red-400 hover:text-red-300 cursor-pointer transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </motion.ul>
      )}
    </Drawer>
  );
};

export default Wishlist;
