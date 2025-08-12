import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Hero", to: "hero" },
  { name: "About", to: "about" },
  { name: "Suggestions", to: "suggestion" },
  { name: "Testimonials", to: "testimonial" },
  { name: "Contact", to: "newsletter" },
];

const MainHeader = ({ activeLink, setActiveLink, fixedClass }) => {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <header
        className={`${
          fixedClass ? "fixed" : "absolute"
        } top-0 left-0 w-full py-4 px-12 flex items-center justify-between transition-all duration-500 z-10`}
        data-aos="fade-in"
      >
        <img src="/logo.png" alt="" className="w-[120px] h-[70px] bg-cover" />
        {/* navbar & buttons for large-screen devices */}
        <nav className="lg:flex lg:flex-row flex-col items-center justify-between hidden">
          <ul className="list-none flex gap-6 text-sm">
            {navItems.map((item) => (
              <li key={item.to} className="font-bold text-gray-600">
                <ScrollLink
                  to={item.to}
                  smooth={true}
                  duration={500}
                  offset={0}
                  onClick={() => setActiveLink(item.to)}
                  className={`cursor-pointer transition-colors hover:text-indigo-400 ${
                    activeLink === item.to
                      ? "font-extrabold scale-110 text-indigo-400"
                      : ""
                  }`}
                >
                  {item.name}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:flex lg:flex-row flex-col items-center gap-2 hidden">
          <button
            type="button"
            className="w-26 h-12 py-1 px-4 outline-none border-4 border-teal-800 text-teal-800 hover:bg-teal-700 hover:border-teal-700 hover:text-white rounded-[40px] font-bold text-[12.5px] uppercase tracking-widest cursor-pointer transition duration-300"
            onClick={() => navigate("auth?mode=signIn")}
          >
            LogIn
          </button>
          <button
            type="button"
            className="w-26 h-12 py-1 px-4 outline-none border-4 border-teal-800 bg-teal-800 text-white hover:bg-teal-700 hover:border-teal-700 rounded-[40px] font-bold text-[12.5px] uppercase tracking-widest cursor-pointer transition duration-300"
            onClick={() => navigate("auth?mode=signUp")}
          >
            SignUp
          </button>
        </div>

        {/* menu-toggler */}
        <motion.div
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 700 }}
          className="lg:hidden group flex justify-center items-center cursor-pointer"
          onClick={() => setShowNav(!showNav)}
        >
          <i className="fa-solid fa-bars text-2xl transition-all duration-200 text-gray-400 group-hover:text-gray-500" />
        </motion.div>
      </header>

      {/* navbar & buttons for tablets, phones */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="!fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center bg-[rgba(0,0,0,0.9)] backdrop-blur-sm select-none z-20"
          >
            {/* menu-toggler */}
            <motion.div
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 700 }}
              className="absolute top-6 right-6 group flex justify-center items-center cursor-pointer"
              onClick={() => setShowNav(!showNav)}
            >
              <i className="fa-solid fa-xmark text-2xl transition-all duration-200 text-white group-hover:text-gray-200" />
            </motion.div>
            <nav className="flex flex-col items-center justify-between text-center">
              <ul className="list-none flex flex-col gap-6 text-lg">
                {navItems.map((item) => (
                  <li key={item.to} className="font-bold text-gray-600">
                    <ScrollLink
                      to={item.to}
                      smooth={true}
                      duration={500}
                      offset={0}
                      onClick={() => {
                        setActiveLink(item.to);
                        setShowNav(!showNav);
                      }}
                      className={`cursor-pointer transition-colors hover:text-indigo-400 ${
                        activeLink === item.to
                          ? "font-extrabold scale-110 text-indigo-400"
                          : ""
                      }`}
                    >
                      {item.name}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col mt-15 items-center gap-4">
              <button
                type="button"
                className="w-40 h-12 py-1 px-4 outline-none border-4 border-teal-800 text-teal-800 hover:bg-teal-700 hover:border-teal-700 hover:text-white rounded-[40px] font-bold text-[12.5px] uppercase tracking-widest cursor-pointer transition duration-300"
                onClick={() => navigate("auth?mode=signIn")}
              >
                LogIn
              </button>
              <button
                type="button"
                className="w-40 h-12 py-1 px-4 outline-none border-4 border-teal-800 bg-teal-800 text-white hover:bg-teal-700 hover:border-teal-700 rounded-[40px] font-bold text-[12.5px] uppercase tracking-widest cursor-pointer transition duration-300"
                onClick={() => navigate("auth?mode=signUp")}
              >
                SignUp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainHeader;
