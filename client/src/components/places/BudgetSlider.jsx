import { useState } from "react";
import { motion } from "framer-motion";

export default function BudgetSlider() {
  const [value, setValue] = useState(10000);
  const min = 3000;
  const max = 50000;

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <>
      <div className="relative w-full mt-5 mx-1">
        {/* Track (empty) */}
        <div className="absolute top-1/2 left-0 h-2 w-full rounded-full bg-gray-700 -translate-y-1/2" />

        {/* Track (filled) */}
        <motion.div
          className="absolute top-1/2 left-0 h-2 rounded-full bg-indigo-500 -translate-y-1/2"
          style={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />

        {/* Input range (native hidden thumb, only drag area) */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute -top-1.5 left-0 w-full h-6 opacity-0 cursor-pointer"
        />

        {/* Custom Thumb + Bubble */}
        <motion.div
          className="absolute -top-[18px] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group z-3"
          style={{ left: `${percentage}%` }}
          transition={{ type: "spring", damping: 15, stiffness: 700 }}
        >
          {/* Value bubble (only on hover) */}
          <div className="mb-3 px-2 py-1 text-xs font-semibold text-white bg-gray-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition">
            ₹ {value}
          </div>

          {/* Custom Thumb Circle */}
          <motion.div
            className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white shadow-lg"
            whileHover={{
              scale: 1.2,
              boxShadow: "0 0 12px rgba(99,102,241,0.8)",
            }}
            transition={{ type: "spring", stiffness: 700 }}
          />
        </motion.div>
      </div>

      {/* Labels */}
      <div className="relative flex justify-between text-sm text-gray-100 pt-2 -me-1.5 mb-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </>
  );
}
