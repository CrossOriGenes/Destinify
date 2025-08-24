import { useState, useRef } from "react";
import { motion } from "framer-motion";
import CheckBox from "../UI/CheckBox";
import BudgetSlider from "./BudgetSlider";

const FilterListForm = ({ defaultCategories = [], initialDays, onFilter }) => {
  const [categories, setCategories] = useState(defaultCategories);
  const [budget, setBudget] = useState(10000);
  const [duration, setDuration] = useState(initialDays);
  const [ratingCount, setRatingCount] = useState(3);

  const handleCategoryChange = (id) => {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBudgetChange = (val) => {
    setBudget(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      categories,
      budget,
      duration,
      rating: ratingCount,
    };
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="ml-2 mt-10">
        <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
          Categories
        </h5>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-2 mt-3 select-none">
          {[
            "Beaches",
            "Mountains",
            "Road-trips",
            "Cities",
            "Heritage",
            "Adventure",
          ].map((cat, idx) => (
            <CheckBox
              key={idx}
              id={cat}
              label={cat}
              checked={categories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
          ))}
        </div>
      </div>
      <div className="ml-2 mt-10">
        <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
          Budget
        </h5>
        <div className="w-full mt-3 relative select-none">
          <BudgetSlider value={budget} onChange={handleBudgetChange} />
        </div>
      </div>
      <div className="ml-2 mt-10">
        <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
          Duration
        </h5>
        <div className="w-full gap-2 mt-3 select-none">
          <select
            id="duration"
            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg py-2 px-4 text-white text-sm outline-none"
            onChange={(e) => setDuration(e.target.value)}
          >
            <option
              value={"1-3"}
              defaultChecked={initialDays >= 1 && initialDays <= 3}
            >
              Weekend (1-3 days)
            </option>
            <option
              value={"4-6"}
              defaultChecked={initialDays >= 4 && initialDays <= 6}
            >
              Short trip (4-6 days)
            </option>
            <option value={"7+"} defaultChecked={initialDays > 6}>
              Long holiday (7+ days)
            </option>
          </select>
        </div>
      </div>
      <div className="ml-2 mt-10">
        <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
          Rating
        </h5>
        <div className="w-[90%] grid grid-cols-4 mt-3.5 place-items-center select-none">
          <button
            type="button"
            className="w-10 h-10 p-2 rounded-full flex justify-center items-center text-lg text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition duration-300"
            onClick={() =>
              setRatingCount((prev) => (prev < 5 ? prev + 1 : prev))
            }
            disabled={ratingCount === 5}
            aria-label="Increase rating"
          >
            <i className="fa-solid fa-plus" />
          </button>
          <input
            type="tel"
            id="rating"
            className="col-span-2 w-full h-10 text-center pb-1.5 font-semibold rounded-4xl outline-none text-2xl text-white bg-gray-500"
            readOnly
            min={1}
            max={5}
            value={ratingCount}
          />
          <button
            type="button"
            className="w-10 h-10 p-2 rounded-full flex justify-center items-center text-lg text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition duration-300"
            onClick={() =>
              setRatingCount((prev) => (prev > 1 ? prev - 1 : prev))
            }
            disabled={ratingCount === 1}
            aria-label="Decrease rating"
          >
            <i className="fa-solid fa-minus" />
          </button>
        </div>
      </div>
      <div className="ml-2 mt-15">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", damping: 15, stiffness: 700 }}
          className="w-full bg-purple-700 border-2 border-purple-700 py-2 px-8 text-center rounded-xl hover:bg-purple-600 hover:border-purple-600 cursor-pointer"
        >
          <span className="uppercase font-semibold text-xl tracking-wider text-white">
            Apply
          </span>
        </motion.button>
      </div>
    </form>
  );
};

export default FilterListForm;
