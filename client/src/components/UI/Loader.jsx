import { motion } from "framer-motion";

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const DotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
  },
};

const DotTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut",
};

// const colors = ["#ef5c72", "#7054e6", "#f89321", "#00c7c4"];

const Loader = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center z-1">
      <div className="pt-20 w-full place-items-center">
        <motion.div
          className="w-40 h-20 flex justify-around"
          variants={ContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.span
            className="w-8 h-8 bg-[#ef5c72] rounded-full"
            variants={DotVariants}
            transition={DotTransition}
          />
          <motion.span
            className="w-8 h-8 bg-[#7054e6] rounded-full"
            variants={DotVariants}
            transition={DotTransition}
          />
          <motion.span
            className="w-8 h-8 bg-[#f89321] rounded-full"
            variants={DotVariants}
            transition={DotTransition}
          />
        </motion.div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
