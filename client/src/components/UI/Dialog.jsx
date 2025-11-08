import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const Dialog = ({ className, title, children, onClose, onAction }) => {
  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "tween", damping: 25, stiffness: 500 }}
        className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-70 cursor-default"
      />
      <motion.dialog
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 600 }}
        className="fixed top-[calc(100vh-83%)] w-[26rem] max-w-[90%] mt-8 mx-auto border-none outline-none p-2 rounded-xl shadow-lg z-100 bg-gray-800"
        open
      >
        <header
          className={`flex items-center justify-between py-2 px-4 ${
            className ? className : ""
          }`}
        >
          <h2 className="font-extrabold text-2xl tracking-wide text-purple-300 capitalize">{title}</h2>
          <i
            className="fa-solid fa-xmark font-medium text-gray-500 hover:text-gray-300 text-lg transition duration-300"
            onClick={onClose}
          />
        </header>
        <div className="bg-gray-700 rounded-2xl">{children}</div>
        {onAction && (
          <footer className="flex items-center justify-end gap-2 mt-3">
            <button
              type="button"
              className="w-[120px] h-10 rounded-3xl bg-purple-700 hover:bg-purple-600 transition duration-300 cursor-pointer"
              onClick={onAction}
            >
              <strong className="font-bold text-[15px] text-purple-50 tracking-wide">
                Done
              </strong>
            </button>
          </footer>
        )}
      </motion.dialog>
    </>,
    document.getElementById("overlays")
  );
};

export default Dialog;
