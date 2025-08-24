import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import PlaceSuggestionForm from "./PlaceSuggestionForm";
import LoaderBackdrop from "../UI/LoaderBackdrop";

const SPECS = [
  {
    clr: "#00d3f2",
    lbl: "AI-generated Suggestions",
    pic: "/images/AI-icon.png",
  },
  { clr: "#ffb900", lbl: "Elaborative Map-view", pic: "/images/map-icon.png" },
  {
    clr: "#fb64b6",
    lbl: "Transport-cost Effective",
    pic: "/images/currency-icon.png",
  },
  { clr: "#00D492", lbl: "Vast spots-list", pic: "/images/places-icon.png" },
  {
    clr: "#c27aff",
    lbl: "Event-based Searches",
    pic: "/images/events-icon.png",
  },
];

const FormSection = () => {
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const iconRefs = useRef([]);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  const items = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  function animateListIconIn(index) {
    const icon = iconRefs.current[index];
    if (!icon) return;

    gsap.set(icon, { rotation: 0 });
    const tl = gsap.timeline();
    tl.to(icon, {
      scale: 0,
      rotation: 360,
      duration: 0.15,
      ease: "power1.in",
    }).to(icon, {
      scale: 1,
      duration: 0.2,
      ease: "back.out(2)",
    });
  }
  function animateListIconOut(index) {
    const icon = iconRefs.current[index];
    if (!icon) return;

    gsap.set(icon, { rotation: 360 });
    const tl = gsap.timeline();
    tl.to(icon, {
      scale: 0,
      rotation: 0,
      duration: 0.15,
      ease: "power1.in",
    }).to(icon, {
      scale: 1,
      duration: 0.2,
      ease: "back.out(2)",
    });
  }

  function getSuggestivePlacesHandler(searchData) {
    // console.log(searchData);
    setLoad(true);
    setTimeout(() => {
      setLoad(!load);
      navigate("../places", { state: searchData });
    }, 3000);
  }

  return (
    <>
      <section
        id="suggestion"
        className="w-full min-h-screen relative p-[140px] overflow-hidden"
      >
        <div className="absolute bottom-8 right-8 w-[160px] h-[160px] rounded-b-full bg-[url('/images/dots.png')] bg-cover bg-center rotation-animate" />
        <div className="absolute top-0 left-0 w-full h-[140vh] bg-gray-100 -z-1">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/line-trail.png')] bg-cover bg-center bg-no-repeat opacity-10" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <h5 className="text-xl font-extrabold text-indigo-500 uppercase tracking-widest">
            Be it a short or a long trip
          </h5>
          <h1 className="text-7xl font-extrabold" data-aos="fade-up">
            The best enhanced suggestions is here
          </h1>
        </div>
        <motion.div
          ref={containerRef}
          variants={variants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="mx-auto my-10 grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8"
        >
          {SPECS.map((item, idx) => (
            <motion.div
              key={idx}
              variants={items}
              className="group flex flex-col px-4 mx-2 place-items-center cursor-default"
              onMouseEnter={() => animateListIconIn(idx)}
              onMouseLeave={() => animateListIconOut(idx)}
            >
              <div className="relative w-[230px] h-[230px] flex items-center justify-center">
                <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden mb-2 mx-4">
                  <img
                    ref={(el) => (iconRefs.current[idx] = el)}
                    src={item.pic}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 w-full h-[50%] border-8 rounded-t-none border-t-0 rounded-b-[200px] border-[rgba(0,0,0,0.15)] transition-colors duration-700 group-hover:border-[#fb64b6]" />
              </div>
              <div className="mt-6 flex flex-col text-center">
                <strong className="font-bold text-lg text-gray-700 hover:text-cyan-600 transition duration-500 leading-5">
                  {item.lbl}
                </strong>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="relative xl:mx-12 lg:mx-6 -mx-24 mt-35 mb-5">
          <div className="absolute top-[-4rem] left-[-5.5rem] w-[200px] h-[180px] bg-[url('/images/plane.png')] bg-no-repeat bg-cover z-4 -rotate-135 float-animate-4" />
          <div className="relative card min-h-[40rem] rounded-4xl overflow-clip">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/card-bg.png')] bg-no-repeat bg-cover bg-center opacity-100" />
            <div className="absolute -bottom-2 right-[-3rem] w-[980px] h-[260px] bg-[url('/images/sea_boat-vector.png')] bg-no-repeat bg-cover" />
            <div className="relative px-[70px] py-[100px] flex items-start my-auto">
              <div className="flex flex-col px-2 w-full md:w-[45%]">
                <h2 className="text-6xl font-extrabold text-white">
                  Find your travel-space
                </h2>
                <p className="text-lg text-gray-500 font-semibold mt-6 leading-6">
                  Just provide your holiday requirements & let us do rest to
                  give you the best suggestive tourable places possible just
                  with a button click!
                </p>
              </div>
              <div
                className="relative flex flex-col pl-2.5 pe-0 w-full md:w-[60%]"
                data-aos="fade-right"
              >
                <PlaceSuggestionForm
                  onSubmitData={getSuggestivePlacesHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>{load && <LoaderBackdrop />}</AnimatePresence>
    </>
  );
};

export default FormSection;
