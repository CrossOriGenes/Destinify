import { useState } from "react";

const CheckBox = ({ id, label, checked, onChange }) => {
  const [check, setCheck] = useState(checked);
  return (
    <div className="inline-flex items-center pl-3 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="hidden"
        onChange={() => {
          setCheck(!check)
          onChange()
        }}
        defaultChecked={checked}
      />
      <div
        className={`w-4 transition-all duration-200 -mt-1 ${
          check
            ? "h-2 border-b-3 border-l-3 border-green-400 -rotate-45"
            : "h-4 border-3 border-amber-200"
        }`}
        onClick={() => setCheck(!check)}
      />
      <label htmlFor={id} className="text-white font-medium ml-2 text-lg">
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
