import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Menu from "./Menu";
import Wishlist from "./Wishlist";

const Header = () => {
  const [open, setOpen] = useState("");

  return (
    <>
      <header className="absolute top-0 left-0 w-full py-3 px-12 flex items-center justify-between z-6">
        <img
          src="/logo.png"
          alt=""
          className="xl:w-[150px] xl:h-[80px] w-[100px] h-[50px] bg-cover"
        />
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 relative rounded-full border-2 border-white overflow-hidden hover:ring-5 hover:ring-gray-700 transition duration-300"
            onClick={() => setOpen("menu")}
          >
            <img
              src="/images/user2.jpg"
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <motion.div
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 700 }}
            className="group flex justify-center items-center cursor-pointer hover:bg-[rgba(0,0,0,0.2)] py-2 px-1 -mx-1 rounded-full"
            onClick={() => setOpen("wishlist")}
          >
            <i className="fa-solid fa-bag-shopping text-2xl transition duration-300 text-gray-900" />
          </motion.div>

          <AnimatePresence>
            {open === "menu" && <Menu onClose={() => setOpen("")} />}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {open === "wishlist" && <Wishlist onClose={() => setOpen("")} />}
      </AnimatePresence>
    </>
  );
};

export default Header;
