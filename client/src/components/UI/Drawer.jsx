import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const Backdrop = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 right-0 w-full h-screen bg-[rgba(0,0,0,0.8)] backdrop-blur-sm z-9"
    />
  );
};

const Drawer = ({ className, titleHead, onClose, children }) => {
  return createPortal(
    <>
      <Backdrop />
      <motion.aside
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 700 }}
        className="fixed top-0 right-0 h-screen w-[22rem] py-4 px-2 bg-gray-700 z-10"
      >
        <header className="flex justify-between items-center p-2">
          <h1 className="text-4xl font-extrabold text-white ml-1">
            {titleHead}
          </h1>
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 800 }}
            className="group w-8 h-8 flex justify-center items-center p-2 rounded-full cursor-pointer"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark text-gray-400 group-hover:text-gray-50 text-2xl transition duration-300" />
          </motion.div>
        </header>
        {children}
      </motion.aside>
    </>,
    document.getElementById("overlays")
  );
};

export default Drawer;
