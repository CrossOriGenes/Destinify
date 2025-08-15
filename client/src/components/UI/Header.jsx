import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Header = () => {
  const [open, setOpen] = useState("");
  const navigate = useNavigate();
  const container = {
    hidden: { opacity: 0, y: -30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.5,
      },
    },
  };
  const list = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

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
            className="group flex justify-center items-center cursor-pointer"
            onClick={() => setOpen("navbar")}
          >
            <i className="fa-solid fa-bars text-2xl transition-all duration-300 text-white group-hover:text-gray-100" />
          </motion.div>

          <AnimatePresence>
            {open === "menu" && (
              <motion.div
                variants={container}
                role="menu"
                aria-orientation="vertical"
                initial="hidden"
                animate="show"
                exit="hidden"
                className="absolute top-14 right-0 w-[250px] h-[170px] bg-amber-50 rounded-lg shadow-xl z-6"
              >
                <div className="absolute -top-1.5 right-14 w-3 h-3 bg-amber-50 rotate-45" />
                <div className="relative py-3 px-1">
                  <div className="flex items-center justify-around mt-1">
                    <img
                      src="/images/user2.jpg"
                      alt=""
                      className="w-15 h-15 bg-cover bg-center rounded-full"
                    />
                    <div className="flex flex-col -ml-8">
                      <h4 className="text-lg font-extrabold text-wrap">
                        Snehodipto Das
                      </h4>
                      <p className="font-medium text-xs text-gray-500">
                        abc@gmail.com
                      </p>
                    </div>
                  </div>
                  <hr className="w-full text-gray-300 mt-3 -mb-1" />
                  <motion.ul
                    variants={container}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="list-none flex flex-col mt-2 px-1"
                  >
                    <motion.li
                      variants={list}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="inline-flex items-center py-1.5 w-full hover:bg-gray-400 rounded-sm cursor-default"
                      onClick={() => {
                        navigate("profile");
                        setOpen("");
                      }}
                    >
                      <i className="fa-solid fa-user mx-1 text-[16px]" />
                      <span className="font-semibold text-[15px]">
                        Manage Profile
                      </span>
                    </motion.li>
                    <motion.li
                      variants={list}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="inline-flex items-center py-1.5 w-full hover:bg-gray-400 rounded-sm cursor-default text-red-800"
                      onClick={() => setOpen("")}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket mx-1 text-[16px]" />
                      <span className="font-semibold text-[15px]">Log out</span>
                    </motion.li>
                  </motion.ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>{open === "navbar" && <Navbar />}</AnimatePresence>
    </>
  );
};

export default Header;
