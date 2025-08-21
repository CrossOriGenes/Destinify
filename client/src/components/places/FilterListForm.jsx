import { useState } from "react";
import { motion } from "framer-motion";
import CheckBox from "../UI/CheckBox";
import BudgetSlider from "./BudgetSlider";

const FilterListForm = () => {
  const [ratingCount, setRatingCount] = useState(3);
  return (
    <form>
      <div className="ml-2 mt-10">
        <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
          Categories
        </h5>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-2 mt-3 select-none">
          <CheckBox id="category1" label="Beaches" checked={true} />
          <CheckBox id="category2" label="Mountains" checked={true} />
          <CheckBox id="category3" label="Road-trips" checked={true} />
          <CheckBox id="category4" label="Cities" checked={false} />
          <CheckBox id="category5" label="Heritage" checked={false} />
          <CheckBox id="category6" label="Adventure" checked={false} />
        </div>
      </div>
      <div className="ml-2 mt-10">
        <h5 className="text-zinc-500 font-extrabold text-[17px] uppercase tracking-[3px] pl-1">
          Budget
        </h5>
        <div className="w-full mt-3 relative select-none">
          <BudgetSlider />
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
          >
            <option value={"2-3"} defaultChecked>
              Weekend (2-3 days)
            </option>
            <option value={"4-6"}>Short trip (4-6 days)</option>
            <option value={"7+"}>Long holiday (7+ days)</option>
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
              setRatingCount((prev) => {
                if (prev < 5) return prev + 1;
              })
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
              setRatingCount((prev) => {
                if (prev > 1) return prev - 1;
              })
            }
            disabled={ratingCount === 1}
            aria-label="Decrease rating"
          >
            <i className="fa-solid fa-minus" />
          </button>
        </div>
      </div>
      <div className="ml-2 mt-15">
        <button className="w-full bg-purple-700 border-2 border-purple-700 py-2 px-8 text-center rounded-xl transition duration-300 hover:bg-purple-600 hover:border-purple-600 cursor-pointer">
          <span className="uppercase font-semibold text-xl tracking-wider text-white">
            Apply
          </span>
        </button>
      </div>
    </form>
  );
};

export default FilterListForm;
