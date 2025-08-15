import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RatingsStar from "../UI/RatingsStar";

const PLACES = [
  {
    place_name: "Udaipur",
    pic: "/images/Udaipur.jpg",
    subtitle: "(20+ Best visiting Place)",
    description: "Romantic lakes & regal palaces.",
    rating_val: 4,
  },
  {
    place_name: "Odisha",
    pic: "/images/Odisha.jpg",
    subtitle: "(10+ Best visiting Place)",
    description: "Spiritual vibes & historic treasures.",
    rating_val: 4.5,
  },
  {
    place_name: "Punjab",
    pic: "/images/Punjab.jpg",
    subtitle: "(15+ Best visiting Place)",
    description: "Where tradition meets vibrant hospitality.",
    rating_val: 4,
  },
  {
    place_name: "Goa",
    pic: "/images/Goa.jpg",
    subtitle: "(5+ Best visiting Place)",
    description: "Sun, sand & soul soothing vibes.",
    rating_val: 3.5,
  },
  {
    place_name: "Sikkim",
    pic: "/images/Sikkim.jpg",
    subtitle: "(10+ Best visiting Place)",
    description: "Serenity in every snow-capped peak.",
    rating_val: 5,
  },
  {
    place_name: "Kerala",
    pic: "/images/Kerala.jpg",
    subtitle: "(20+ Best visiting Place)",
    description: "The beauty of the God's-own country.",
    rating_val: 4.5,
  },
];

const Intro = () => {
  const { scrollY } = useScroll();
  const mapScrollY = useTransform(
    scrollY,
    [0, 950, 1500, 2000],
    [0, -5, -50, -100]
  );

  return (
    <section id="intro" className="w-full min-h-screen relative pb-8 overflow-hidden bg-gray-800">
      <div
        className="absolute bottom-0 left-0 w-full h-[300px] bg-blend-screen z-5"
        style={{ background: "linear-gradient(to top, #030712, transparent)" }}
      />
      <div className="relative w-full">
        <div className="absolute top-20 -left-30 h-[800px] w-[500px] pointer-events-none bg-[url('/images/icon-group-1.png')] bg-cover bg-center opacity-10 float-animate" />
        <div className="absolute w-[40%] h-screen top-0 right-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            src="https://res.cloudinary.com/dtfoedy3u/video/upload/v1755059125/travel_bg_lg7fhx.mp4"
            className="absolute top-0 right-0 w-full h-full object-cover"
          />
        </div>
        <div className="relative w-[60%] xl:p-[140px] py-28 px-20 text-white">
          <motion.div
            className="absolute top-[27%] -right-50 xl:w-[550px] xl:h-99 w-[400px] h-80 bg-[url('/images/india-map.png')] bg-cover bg-center pointer-events-none z-2"
            style={{ y: mapScrollY }}
          />
          <h1 className="font-extrabold text-6xl capitalize z-3" data-aos="fade-right">
            Explore places of <span className="text-indigo-500">India</span>
          </h1>
          <p
            className="relative font-medium text-md text-gray-400 leading-5 xl:w-[550px] w-[480px] text-wrap mt-6 z-3"
            data-aos="fade-in"
          >
            At Destinify, we believe that travel is not just about reaching
            destinations -- its about the stories you create along the way.
            Whether you're hiking through the snowy trails of the Himalayas,
            thriving through the dense rainforests in the mid-America or
            exploring the spiritual richness of India, we suggest journeys that
            speak to the soull. Our expert-curated itineries are made for every
            kind of traveler.
            <br />
            Our mission is to make meaningful travel accessible, safe, and
            unforgettable. We bring together years of travel experience, global
            knowledge, and a passion for creating memories that last a lifetime.
            Whether you're plannig a solo adventure, a romantic gateway or a
            family holiday, we're here to guide you from inspiration to boooking
            and beyond. Browser through hand-picked destinations, read real
            travel stories, and choose from curated packages that go beyond the
            usual.
          </p>
          <div className="mt-12" data-aos="fade-up">
            <button className="btn-dark w-45 z-3">
              <span className="font-bold text-sm uppercase tracking-wide text-white">
                View More
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="relative w-full xl:p-[140px] py-40 px-20">
        <div className="place-items-center text-white">
          <h1 className="font-extrabold capitalize text-6xl pb-3" data-aos="fade-up">
            Explore the <span className="text-indigo-500">spirit of India</span>
          </h1>
          <p
            className="xl:w-4xl md:w-2xl w-3xs py-2 text-center text-md text-gray-300 text-wrap pb-2"
            data-aos="fade-in"
          >
            At Destinify, your adventure begins with the moment you dream it --
            and we're with you all the way, turning that dream into a journey
            worth remembering.
          </p>
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 my-12 mx-10">
          {PLACES.map((place, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.15,
              }}
              viewport={{ once: true }}
              className="card relative group rounded-3xl h-[250px] py-4 px-5 shadow-lg cursor-pointer overflow-clip hover:shadow-xl hover:shadow-gray-500 hover:scale-105 hover:rotate-1 transition duration-300"
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
                    <RatingsStar value={place.rating_val} style={{ maxWidth: 85 }} />
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
      </div>
    </section>
  );
};

export default Intro;
