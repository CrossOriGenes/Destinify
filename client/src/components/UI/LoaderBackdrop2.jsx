import { motion } from "framer-motion";

const LoaderBackdrop2 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", damping: 15, stiffness: 700 }}
      className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-md z-10 pointer-events-none cursor-not-allowed"
    >
      <div className="flex justify-center items-center gap-2">
        <h3 className="uppercase font-bold text-[26px] tracking-widest text-white">
          Signing in...
        </h3>
        <span className="block w-10 h-10 border-t-4 border-r-4 border-indigo-400 ml-2 rounded-full animate-spin" />
      </div>
    </motion.div>
  );
};

export default LoaderBackdrop2;
