import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GotoTopButton = () => {
  const [fixedBtn, setFixedBtn] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      setFixedBtn(scrollY > 1340);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${
        fixedBtn ? "fixed" : "hidden"
      } bottom-5 right-5 w-full flex items-center justify-end z-20`}
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", damping: 15, stiffness: 900 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-12 h-12 bg-pink-800 hover:bg-pink-600 rounded-full cursor-pointer transition-colors duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa-solid fa-arrow-up text-white text-xl" />
      </motion.button>
    </div>
  );
};

export default GotoTopButton;
