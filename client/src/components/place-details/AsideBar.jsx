import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "Description", to: "place-descr-intro" },
  { name: "Rating", to: "ratings" },
  { name: "Gallery", to: "place-img-gallery" },
  { name: "Festivals", to: "festivals" },
  { name: "Journey-estimation & Budget", to: "estim-budget" },
];

const AsideBar = ({ activeLink, setActiveLink, fixedClass }) => {
  const navigate = useNavigate();
  return (
    <aside className="relative xl:col-span-1 xl:flex flex-col hidden bg-transparent mb-5">
      <div className="border-4 border-purple-400 bg-purple-900 rounded-3xl p-4 w-full h-58 ml-20 -me-10 mb-10">
        <h2 className="text-3xl text-white">Contents</h2>
        <nav className="mt-2">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li
                key={item.to}
                className="inline-flex items-center text-md py-0.5 group"
              >
                <i className="fa-solid fa-plane me-1 text-cyan-200 -rotate-45" />
                <ScrollLink
                  to={item.to}
                  smooth={true}
                  duration={500}
                  offset={0}
                  onClick={() => setActiveLink(item.to)}
                  className={`group-hover:text-purple-200 transition duration-300 cursor-pointer ${
                    activeLink === item.to
                      ? "text-purple-200 font-extrabold"
                      : "text-purple-400 font-semibold"
                  }`}
                >
                  {item.name}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="relative card w-full h-[220px] flex flex-col justify-center items-center bg-gray-700 border-1 border-gray-600 p-6 rounded-3xl shadow-xl ml-20 -me-10 mb-10">
        <h3 className="capitalize text-3xl font-bold text-indigo-100 tracking-wider">
          Want more from us?
        </h3>
        <p className="text-md font-light text-gray-300 mt-3 leading-5 tracking-wide">
          Check our pricing to avail a bunch of customized facilities!
        </p>
        <div className="w-full items-start">
          <button
            className="btn2 group mt-6"
            onClick={() => navigate("../../pricings")}
          >
            <span className="text-[16px] font-semibold text-[#100624] group-hover:text-white me-2">
              Our Pricings
            </span>
            <div className="w-7 h-7 rounded-full flex justify-center items-center bg-[#100624] group-hover:bg-white -me-4">
              <i className="fa-solid fa-arrow-right text-white group-hover:text-[#100624] rotate-45 group-hover:rotate-0 transition duration-300" />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AsideBar;
