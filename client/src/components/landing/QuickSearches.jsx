import { motion, useScroll, useTransform } from "framer-motion";
import RatingsStar from "../UI/RatingsStar";

const PLACES = [
  {
    place_name: "Manali",
    pic: "/images/Manali.jpg",
    subtitle: "(20+ Best visiting Place)",
    description: "Snowy escapes in Himachal Pradesh.",
    rating_val: 4,
  },
  {
    place_name: "Leh",
    pic: "/images/Leh.jpg",
    subtitle: "(30+ Best visiting Place)",
    description: "Cozy heaven of Earth.",
    rating_val: 4.5,
  },
  {
    place_name: "Everest",
    pic: "/images/Himalayas.jpg",
    subtitle: "(10+ Best visiting Place)",
    description: "Where the Earth touches the sky.",
    rating_val: 3,
  },
];

const QuickSearches = () => {
  const { scrollY } = useScroll();
  const textYScroll = useTransform(
    scrollY,
    [3000, 3200, 3500, 3800, 4100],
    [-100, -250, -500, -750, -1000]
  );
  const mountain1ScrollY = useTransform(
    scrollY,
    [3000, 3200, 3500, 3800, 4100],
    [-45, -25, 5, 15, 25]
  );
  const mountain2ScrollY = useTransform(
    scrollY,
    [3000, 3200, 3500, 3800, 4100],
    [30, 0, -35, -70, -140]
  );

  return (
    <section id="gallery" className="w-full min-h-[80vh] bg-gray-950">
      <div className="w-full h-[120vh] relative pt-[100px] px-[50px] flex justify-between overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-full h-[700px] bg-blend-screen z-5"
          style={{
            background: "linear-gradient(to top, #030712, transparent)",
          }}
        />
        <div className="flex flex-col w-1/3 -mt-3.5 z-6" data-aos="fade-up">
          <p className="text-gray-500 font-medium text-sm mb-6">
            Escape the ordinary and scale breathtaking heights of the peaks of
            Kathmandu! Our hiking package recommendations are designed specially
            for witnessing every level of adventure, offering unforgettable
            views, local culture, and the pure joy of conquering nature.
            <br />
            Visit the link below to get direct access to all hiking packages for
            Nepal and the foothills of Everest
          </p>
          <button className="btn w-35 cursor-pointer z-3">
            <span className="font-bold text-sm uppercase tracking-wide text-white">
              View More
            </span>
          </button>
        </div>

        <motion.h1
          className="text-8xl sigmar-font text-white text-right leading-20 transform translate-y-1/2"
          style={{ y: textYScroll }}
        >
          Want to hike the{" "}
          <span className="sigmar-font text-indigo-400">Himalayas?</span>
        </motion.h1>
        <motion.img
          src="/images/mountain_range-2.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-full select-none"
          style={{ bottom: mountain2ScrollY }}
        />
        <motion.img
          src="/images/mountain_range-1.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-full select-none"
          style={{ bottom: mountain1ScrollY }}
        />
      </div>
      <div className="relative p-[140px]">
        <p className="text-gray-400 -mt-18 mb-20 text-lg" data-aos="fade-up">
          Our mission is to make meaningful travel accessible, safe, and
          unforgettable. We bring together years of travel experience, global
          knowledge, and a passion for creating memories that last a lifetime.
          Whether you're plannig a solo adventure, a romantic gateway or a
          family holiday, we're here to guide you from inspiration to boooking
          and beyond. Browser through hand-picked destinations, read real travel
          stories, and choose from curated packages that go beyond the usual.
        </p>
        <div className="grid xl:grid-cols-3 grid-cols-1 gap-8 mt-9 mb-18">
          {PLACES.map((place, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.3,
              }}
              viewport={{ once: true }}
              className="card relative group rounded-3xl h-[500px] py-4 px-5 shadow-lg cursor-pointer overflow-clip hover:shadow-xl hover:shadow-gray-500 hover:scale-105 hover:rotate-1 transition duration-300"
            >
              <div
                className="absolute bottom-0 left-0 w-full h-[200px] bg-blend-screen z-1"
                style={{
                  background: "linear-gradient(to top, #000, transparent)",
                }}
              />
              <img
                src={place.pic}
                alt={place.place_name}
                className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-120 transition-transform duration-300"
              />
              <div className="w-full h-full relative flex items-end justify-between text-white z-2 opacity-90">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-1">
                    <RatingsStar
                      value={place.rating_val}
                      style={{ maxWidth: 85 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-2xl">
                      {place.place_name}
                    </h3>
                    <span className="text-sm font-medium text-indigo-100">
                      {place.subtitle}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    {place.description}
                  </p>
                </div>
                <div className="w-[25px] h-[25px] flex items-center justify-center rounded-full border-2 border-indigo-400">
                  <i className="fa fa-arrow-right text-sm text-indigo-400 rotate-45 transition duration-300 group-hover:rotate-0" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="relative w-full place-items-center" data-aos="fade-up">
          <div className="w-[460px] border-2 p-1.5 border-gray-600 rounded-[35px] flex items-center justify-between">
            <p className="font-normal text-md text-white pl-6">
              Explore over <em className="text-amber-200">1k+</em> more
              places...
            </p>
            <button className="btn w-45 z-3">
              <span className="font-bold text-sm uppercase tracking-wide text-white">
                View More
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickSearches;
