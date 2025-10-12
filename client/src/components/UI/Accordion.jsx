import { motion, AnimatePresence } from "framer-motion";

const Accordion = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="w-full not-last:border-b-2 border-cyan-500 overflow-hidden bg-transparent backdrop-blur-sm">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 py-4 bg-gray-700 hover:bg-gray-600 transition-all duration-200"
      >
        <span className="font-semibold text-white">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "tween", stiffness: 400 }}
        >
          <i className="fa-solid fa-caret-down text-cyan-100" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", stiffness: 400 }}
            className="px-6 pb-4 text-gray-700 leading-relaxed overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
