import React from "react";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full py-3 px-12 flex items-center justify-between">
      <img src="/logo.png" alt="" className="xl:w-[150px] xl:h-[70px] w-[100px] h-[50px] bg-cover" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gray-400 bg-amber-300" />
      </div>
    </header>
  );
};

export default Header;
