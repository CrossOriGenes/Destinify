import { motion, useScroll, useTransform } from "framer-motion";

const MainSection = () => {
  const { scrollY } = useScroll();
  const textScrollVal = useTransform(
    scrollY,
    [10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 300],
    [
      250, 150, 100, 0, -100, -150, -250, -300, -450, -500, -650, -750, -850,
      -950, -1000,
    ]
  );
  const mnt1ScrollYVal = useTransform(
    scrollY,
    [10, 30, 50, 70, 90, 110, 130],
    [30, 20, 10, 0, -10, -20, -30]
  );
  const mnt2ScrollYVal = useTransform(
    scrollY,
    [10, 30, 50, 70, 90, 110, 130],
    [10, 0, -10, -15, -30, -45, -60]
  );
  const mnt3ScrollYVal = useTransform(
    scrollY,
    [10, 30, 50, 70, 90, 110, 130],
    [90, 70, 50, 30, 10, -10, -30]
  );
  const mnt4ScrollYVal = useTransform(
    scrollY,
    [10, 30, 50, 70, 90, 110, 130],
    [90, 80, 70, 60, 50, 40, 30]
  );
  const treesScrollYVal = useTransform(
    scrollY,
    [10, 30, 50, 70, 90, 110, 130],
    [110, 90, 70, 50, 30, 10, -10]
  );
  const cablecarsScrollXVal = useTransform(
    scrollY,
    [10, 30, 50, 70, 90, 110, 130],
    [0, -5, -10, -15, -20, -25, -30]
  );
  return (
    <section id="home" className="w-full min-h-screen flex items-center justify-center overflow-hidden bg-blue-300">
      <motion.h1
        className="sigmar-font text-white text-stroke-dark xl:text-[120px] md:text-7xl text-5xl text-center xl:w-full w-24 text-wrap leading-28 z-1"
        style={{ x: textScrollVal }}
      >
        Welcome to{" "}
        <span className="sigmar-font text-indigo-600">Destinify</span>
      </motion.h1>
      <motion.img
        src="/images/mnt_01.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ y: mnt1ScrollYVal }}
      />
      <motion.img
        src="/images/mnt_02.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ y: mnt2ScrollYVal }}
      />
      <motion.img
        src="/images/mnt_03.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ y: mnt3ScrollYVal }}
      />
      <motion.img
        src="/images/mnt_04.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ y: mnt4ScrollYVal }}
      />
      <motion.img
        src="/images/trees.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-2"
        style={{ y: treesScrollYVal }}
      />
      <img
        src="/images/house.png"
        alt=""
        className="absolute -bottom-10 left-0 w-full h-full pointer-events-none z-3"
      />
      <motion.img
        src="/images/cable_cars.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ x: cablecarsScrollXVal }}
      />
      <div className="w-full h-[50px] absolute bottom-0 left-0 bg-transparent rounded-b-[36px] z-5 shadow-solid-dark" />
      <div className="p-[70px] absolute top-0 left-0 w-full h-full flex items-end justify-start z-4">
        <div className="relative card w-92 h-50 bg-[rgba(0,0,0,0.4)] border-1 border-gray-500 p-6 backdrop-blur-md shadow-xl">
          <h3 className="capitalize text-3xl font-bold text-indigo-100 tracking-wider">
            Why wait?
          </h3>
          <p className="text-md font-light text-gray-200 mt-3 leading-5">
            Explore the world with us a bunch of customized facilities!
          </p>
          <button className="btn2 group mt-6">
            <a className="text-[16px] font-semibold text-[#100624] group-hover:text-white me-2">Learn More</a>
            <div className="w-7 h-7 rounded-full flex justify-center items-center bg-[#100624] group-hover:bg-white -me-4">
              <i className="fa-solid fa-arrow-right text-white group-hover:text-[#100624] rotate-45 group-hover:rotate-0 transition duration-300" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainSection;
