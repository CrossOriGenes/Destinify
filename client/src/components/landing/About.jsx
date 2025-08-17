import { Suspense, useRef } from "react";
import gsap from "gsap";
import { motion, useTransform, useScroll, useInView } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import EarthModel from "../3dModels/EarthModel";
import { Environment, OrbitControls } from "@react-three/drei";

const FEATURES = [
  { iconClr: "#ef5c72", labelTxt: "Real-time event detection" },
  { iconClr: "#7054e6", labelTxt: "Optimal travel paths" },
  { iconClr: "#f89321", labelTxt: "Personalized recommendations" },
  { iconClr: "#00c7c4", labelTxt: "Interactive 3D exploration" },
];

const AboutUs = () => {
  const iconRefs = useRef([]);
  const { scrollY } = useScroll();
  const titleXScroll = useTransform(
    scrollY,
    [150, 300, 650, 950],
    [300, 150, 15, 0]
  );
  const listContainerRef = useRef(null);
  const isInView = useInView(listContainerRef, { once: true });

  const animateListIconIn = (idx) => {
    const icon = iconRefs.current[idx];
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
  };
  const animateListIconOut = (idx) => {
    const icon = iconRefs.current[idx];
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
  };
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  const listVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <section id="about" className="w-full min-h-[120vh] relative overflow-hidden">
      <div className="absolute lg:top-0 top-8 lg:-left-20 left-0 lg:w-[70%] w-full lg:h-[120vh] h-screen overflow-y-visible cursor-grab">
        <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight
              castShadow
              position={[10, 10, 10]}
              intensity={2}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[0, 5, 5]} intensity={5} />
            <OrbitControls enableZoom={false} />
            <EarthModel />
            <Environment preset="sunset" background={false} />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute right-0 flex justify-end lg:w-[45%] md:w-[100%] w-full h-full select-none z-1">
        <div className="relative flex flex-col lg:p-[100px] md:p-[60px] p-[45px]">
          <h5 className="text-lg font-extrabold text-indigo-500 uppercase tracking-widest text-right z-2">
            Who are we?
          </h5>
          <motion.h1
            className="text-8xl sigmar-font -mt-1 text-right"
            style={{ x: titleXScroll }}
          >
            About Us
          </motion.h1>
          <p
            className="font-medium text-md leading-5 mt-8 text-justify text-gray-500 z-2"
            data-aos="fade-in"
          >
            In todays busy world, individuals often struggle to plan holidays
            that are time-efficient, cost-effective, and culturally enriching.
            Most travel recommendation systems fail to consider personalized
            time spans, budget constraints, and real-time regional events such
            as festivals. But we aim to create an intelligent holiday
            recommendation system using our generative AI, which suggests both
            short-term and long-term vacation destinations based on the user's
            available time, budget, and transport preferences. This system also
            factors in real-time events and ongoing festivals in different
            regions to make the holiday more engaging.
          </p>
          <motion.ul
            ref={listContainerRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="lg:mt-7 mt-9 grid lg:grid-cols-2 grid-cols-1 lg:gap-1 gap-0 z-2"
          >
            {FEATURES.map((list, idx) => (
              <motion.li
                key={idx}
                variants={listVariants}
                onMouseEnter={() => animateListIconIn(idx)}
                onMouseLeave={() => animateListIconOut(idx)}
                className="inline-flex items-center w-full leading-4 px-1 py-2 mb-1 ml-2"
              >
                <i
                  ref={(el) => (iconRefs.current[idx] = el)}
                  className="fa-solid fa-sailboat text-3xl"
                  style={{ color: list.iconClr }}
                />
                <span className="pl-3 font-bold text-gray-800 text-md">
                  {list.labelTxt}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
