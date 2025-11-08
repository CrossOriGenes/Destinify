import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RatingHeart } from "./RatingsStar";
import Drawer from "./Drawer";
import { AppContext } from "../store/AppContext";

const Wishlist = ({ onClose }) => {
  const { wishlist, token, user } = useContext(AppContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(user);
  // }, []);

  return (
    <Drawer
      titleText={
        <h1 className="text-4xl font-extrabold text-white ml-1">
          Your <span className="text-indigo-500">Favs</span>
        </h1>
      }
      onClose={onClose}
    >
      {token && (!wishlist || wishlist.length === 0) && (
        <div className="w-full h-full flex items-center justify-center flex-col -mt-10 px-4">
          <h3 className="font-extrabold text-[26px] text-indigo-200">
            Wishlist is Empty!😢
          </h3>
          <div className="w-54 h-54 relative bg-[url('/images/empty-bag-fallback.png')] bg-center bg-cover" />
          <p className="font-semibold text-md leading-4.5 text-gray-500">
            Your Favlist bag is empty! Please add some places to Favlist.
          </p>
        </div>
      )}
      {!token && wishlist && (
        <div className="w-full h-full flex items-center justify-center flex-col -mt-10 px-4">
          <h3 className="font-extrabold text-[26px] text-gray-300">
            Wishlist is Empty!😢
          </h3>
          <div className="w-54 h-54 relative bg-[url('/images/empty-bag-fallback.png')] bg-center bg-cover" />
          <p className="font-semibold text-sm leading-5 text-gray-400 mb-6">
            Your Favlist bag is empty! Please login/signup & add some places to
            Favlist.
          </p>
          <button
            type="button"
            className="btn-dark z-1 w-[130px]"
            onClick={() => {
              onClose();
              navigate("../../auth?mode=signin");
            }}
          >
            <span className="font-bold tracking-wide text-gray-200 uppercase">
              Login
            </span>
          </button>
        </div>
      )}
      {wishlist && token && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col list-none p-2"
        >
          {wishlist.map((item, i) => (
            <li
              className="w-full flex flex-col items-start justify-between py-4 px-1 border-b-1 border-gray-400"
              key={item.id}
            >
              <div className="w-full flex items-start">
                <img
                  src={item.picture}
                  alt=""
                  className="w-[90px] h-[80px] bg-cover bg-center rounded-md"
                />
                <div className="w-full flex flex-col ml-2.5">
                  <h4 className="w-[60%] font-bold text-indigo-200 truncate">
                    {item.place}
                  </h4>
                  <p className="w-[66%] text-xs py-1 text-white truncate">
                    {item.description}
                  </p>
                  <RatingHeart value={item.rating} style={{ maxWidth: 80 }} />
                </div>
              </div>
              <div className="flex items-end justify-end gap-x-2 w-full -mt-2 -mb-1">
                <button
                  type="button"
                  className="w-[30px] h-[30px] text-center font-semibold text-cyan-500 hover:text-blue-300 cursor-pointer transition duration-300"
                >
                  <i className="fa-solid fa-eye text-[17px]" />
                </button>
                <button
                  type="button"
                  className="w-[30px] h-[30px] text-center font-semibold border-2 border-red-500 text-red-500 hover:border-red-400 hover:bg-red-400 hover:text-white cursor-pointer transition duration-300"
                >
                  <i className="fa-solid fa-trash text-[15px]" />
                </button>
              </div>
            </li>
          ))}
        </motion.ul>
      )}
    </Drawer>
  );
};

export default Wishlist;
