import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { lbl: "Places to travel", value: 500, suffix: "+" },
  { lbl: "Satisfied Users", value: 2000, suffix: "+" },
  { lbl: "Accurate recommendations", value: 95, suffix: "%" },
  { lbl: "Customer active-support", value: 24, suffix: "hrs" },
];

const StatBlock = ({ value, lbl, suffix, delay, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <h3 className="text-6xl font-extrabold text-white">
        <CountUp
          start={isInView ? 0 : null}
          end={value}
          duration={2}
          suffix={suffix}
          delay={0.1}
          className="text-7xl"
        />
      </h3>
      <p className="font-bold text-xl text-indigo-200 text-wrap text-center tracking-wide leading-5 mt-6">
        {lbl}
      </p>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section id="stats" className="relative w-full">
      <div className="absolute inset-0 bg-[url('/images/banner-bg.jpg')] bg-center bg-fixed" />
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-1" />
      <div className="relative px-[140px] py-[120px] place-items-center z-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, idx) => (
            <StatBlock
              key={idx}
              delay={idx * 0.3}
              {...stat}
              className={`flex flex-col justify-center items-center px-8 mx-2 md:mb-4 mb-8 ${
                idx === 3 ? "" : "lg:border-r-2 lg:border-r-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
