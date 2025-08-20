import { motion } from "framer-motion";

const LoaderBackdrop = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", damping: 15, stiffness: 700 }}
      className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-lg z-10 pointer-events-none cursor-not-allowed"
    >
      <div className="flex justify-center items-center">
        <div id="loader">
          <span className="inline-block w-[35px] h-[35px] rounded-full my-[35px] mx-[10px] bg-[#ef5c72]" />
          <span className="inline-block w-[35px] h-[35px] rounded-full my-[35px] mx-[10px] bg-[#7054e6]" />
          <span className="inline-block w-[35px] h-[35px] rounded-full my-[35px] mx-[10px] bg-[#f89321]" />
        </div>
      </div>
      <p className="uppercase font-bold text-lg tracking-widest text-white">
        Personalizing your suggestions...
      </p>
    </motion.div>
  );
};

export default LoaderBackdrop;
