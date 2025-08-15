import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const Backdrop = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-0 right-0 w-full h-screen bg-[rgba(0,0,0,0.2)] backdrop-blur-xs bg-blend-screen z-9"
      style={{ background: "linear-gradient(to left, #000, transparent)" }}
      onClick={onClose}
    />
  );
};

const Navbar = ({ onClose }) => {
  return createPortal(
    <>
      <Backdrop onClose={onClose} />
      <motion.aside
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: "spring", damping: 15, stiffness: 900 }}
        className="fixed xl:top-0 xl:right-0 bottom-0 xl:w-[100px] w-full xl:h-screen h-[100px] bg-gray-700 z-10"
      >
        <div className="flex flex-col w-full h-full justify-between items-center py-12">
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="list-none flex flex-col gap-6"
            transition={{ delayChildren: 0.1 }}
          >
            <li
              className="inline-flex text-3xl text-gray-400"
              onClick={onClose}
            >
              <i className="fa-solid fa-house" />
            </li>
            <li
              className="inline-flex text-3xl text-gray-400"
              onClick={onClose}
            >
              <i className="fa-solid fa-house" />
            </li>
          </motion.ul>
          <div>
            <i className="fa-solid fa-gear" />
          </div>
        </div>
      </motion.aside>
    </>,
    document.getElementById("overlays")
  );
};

export default Navbar;
