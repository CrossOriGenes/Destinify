import { useState } from "react";

export default function BudgetSlider({ value, onChange }) {
  // const [value, setValue] = useState(10000);
  const min = 3000;
  const max = 50000;

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <>
      <div className="relative w-full mt-5 mx-1">
        <div className="relative w-full group">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="slider-thumb w-full"
            style={{
              background: `linear-gradient(to right, #6366f1 ${percentage}%, #374151 ${percentage}%)`,
            }}
          />

          <div
            className="absolute -top-10 -translate-x-1/2 w-[62px] opacity-0 group-hover:opacity-100 transition bg-gray-950 text-white text-xs font-semibold px-2 py-1 rounded"
            style={{ left: `${percentage}%` }}
          >
            <div className="absolute -bottom-1 left-[47%] w-2 h-2 rotate-45 bg-gray-950" />
            ₹ {value}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="relative flex justify-between text-sm text-gray-100 font-medium -me-1.5 mb-2">
        <span>₹ {min}</span>
        <span>₹ {max}</span>
      </div>
    </>
  );
}
