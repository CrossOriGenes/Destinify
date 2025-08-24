import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const EndLinks = () => {
  const [yr, setYr] = useState("");

  useEffect(() => {
    const yrNow = new Date().getFullYear();
    const yrNext = (yrNow % 100) + 1;
    setYr(`${yrNow}-${yrNext}`);
  }, []);

  return (
    <footer className="relative w-full min-h-[45vh] pt-15 bg-gray-950 overflow-hidden">
      <div className="absolute -bottom-13 -right-15 w-[850px] h-[500px] bg-[url('/images/mountain-2.png')] bg-cover bg-center bg-no-repeat z-3" />
      <div className="w-[60%] flex flex-col items-start justify-between pt-5 pb-10 px-[60px]">
        <div className="w-full flex items-center justify-between z-4">
          <img
            src="/logo.png"
            alt=""
            className="w-[250px] h-[150px] object-cover"
          />
          <div className="flex gap-2">
            <a
              href="#0"
              className="group w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-cyan-700 transition duration-300"
            >
              <i className="text-lg text-gray-900 fa-brands group-hover:text-white fa-snapchat" />
            </a>
            <a
              href="#0"
              className="group w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-cyan-700 transition duration-300"
            >
              <i className="text-lg text-gray-900 fa-brands group-hover:text-white fa-youtube" />
            </a>
            <a
              href="#0"
              className="group w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-cyan-700 transition duration-300"
            >
              <i className="text-lg text-gray-900 fa-brands group-hover:text-white fa-facebook-f" />
            </a>
            <a
              href="#0"
              className="group w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-cyan-700 transition duration-300"
            >
              <i className="text-lg text-gray-900 fa-brands group-hover:text-white fa-instagram" />
            </a>
            <a
              href="#0"
              className="group w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-cyan-700 transition duration-300"
            >
              <i className="text-lg text-gray-900 fa-brands group-hover:text-white fa-x-twitter" />
            </a>
          </div>
        </div>
        <h4 className="text-xl text-indigo-300 font-bold pt-3 pb-1">
          Quick Links
        </h4>
        <nav className="w-full pt-1 pb-5">
          <ul className="list-none flex items-center gap-8">
            <li className="font-semibold text-sm text-white hover:text-pink-400 transition duration-300 cursor-pointer">
              <Link to="..">Home</Link>
            </li>
            <li className="font-semibold text-sm text-white hover:text-pink-400 transition duration-300 cursor-pointer">
              <Link to="/pricings">Pricings</Link>
            </li>
            <li className="font-semibold text-sm text-white hover:text-pink-400 transition duration-300 cursor-pointer">
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </nav>
        <hr className="w-full h-0.5 bg-zinc-700" />
        <div className="w-full text-center">
          <p className="text-[15px] font-semibold text-gray-500 py-4">
            <a
              href="#0"
              className="hover:text-pink-300 transition duration-300"
            >
              Privacy Policy{" "}
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#0" className="hover:text-pink-300">
              Terms & Conditions
            </a>
          </p>
        </div>
        <p className="w-full text-center text-[13px] font-medium text-gray-500 pt-3 pb-1">
          &copy; {yr} All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default EndLinks;
