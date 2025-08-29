import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RatingStarSticker, RatingsStarBox } from "../UI/RatingsStar";

const RATINGS = [
  { rating_label: "Climate", rating_val: 4.5 },
  { rating_label: "Hotels", rating_val: 4.5 },
  { rating_label: "Budget", rating_val: 2.5 },
  { rating_label: "Transportation", rating_val: 4 },
  { rating_label: "Sight-seeing", rating_val: 4.5 },
  { rating_label: "Food & water", rating_val: 5 },
];
const REVIEWS = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    user: "John Doe",
    avatar: "/images/user4.jpg",
    rating: 4,
  },
  {
    id: 2,
    text: "Amazing place with great sightseeing and food options!",
    user: "Emily Johnson",
    avatar: "/images/user5.jpg",
    rating: 5,
  },
  {
    id: 3,
    text: "Budget-friendly destination, loved the climate and people.",
    user: "Alyx Brown",
    avatar: "/images/user6.jpg",
    rating: 4.5,
  },
];

const RatingsReviewSection = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="ratings"
      className="relative col-span-4 xl:p-[120px] p-[70px] min-h-screen bg-gray-300"
    >
      <h1 className="text-6xl font-extrabold w-full text-center -mt-2 mb-5">
        Ratings and <span className="text-indigo-500">Reviews</span>
      </h1>
      <div className="relative w-full flex lg:flex-row flex-col mt-15 mb-15">
        <div className="lg:w-[50%] w-full mt-6">
          <h5 className="text-xl font-bold my-1.5 text-gray-800" data-aos="fade-right">
            Overall Rating
          </h5>
          <div className="flex items-end gap-2" data-aos="fade-in">
            <RatingsStarBox
              style={{ maxWidth: 300 }}
              value={4.5}
              className="box-rating"
            />
            <span
              className="font-bold text-gray-500 text-lg -mb-1"
              data-aos="fade-left"
            >
              4.5/5
            </span>
          </div>
          <ul className="relative grid lg:grid-cols-2 grid-cols-1 mt-15 gap-6">
            {RATINGS.map((r, idx) => (
              <li key={idx} className="flex flex-col h-12 me-2.5">
                <span className="font-semibold text-sm text-gray-700 -mb-2.5">
                  {r.rating_label}
                </span>
                <div className="inline-flex items-end justify-between">
                  <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(r.rating_val / 5) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.2 }}
                      className="absolute h-full top-0 left-0 bg-cyan-700 rounded-2xl"
                    />
                  </div>
                  <motion.strong
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1 * idx }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="text-lg -mb-1.5 ml-2.5"
                  >
                    {r.rating_val}
                  </motion.strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:w-[50%] w-full lg:pl-30 lg:py-10 py-20 z-1">
          <div className="relative flex flex-col items-center justify-center w-full h-full" data-aos="fade-left">
            <i className="fa-solid fa-quote-left absolute lg:top-5 -top-10 -left-[60px] text-[9rem] opacity-20" />
            <AnimatePresence mode="wait">
              <motion.div
                key={REVIEWS[index].id}
                initial={{ y: "100%", opacity: 0, rotateX: 90 }}
                animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                exit={{ y: "-100%", opacity: 0, rotateX: -90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full bg-transparent flex flex-col items-center"
              >
                <div className="relative flex flex-col gap-6 lg:mt-0 mt-6">
                  <p className="font-medium text-lg italic leading-5">
                    {REVIEWS[index].text}
                  </p>
                  <div className="w-full flex items-center justify-center gap-3">
                    <img
                      src={REVIEWS[index].avatar}
                      alt=""
                      className="w-10 h-10 rounded-full bg-cover bg-no-repeat object-cover"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-extrabold uppercase tracking-wider text-sm">
                        {REVIEWS[index].user}
                      </h4>
                      <RatingStarSticker
                        style={{ maxWidth: 80 }}
                        value={REVIEWS[index].rating}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-[50px] bg-blend-screen"
        style={{
          background: "linear-gradient(to top, #1e2939, transparent)",
        }}
      />
    </section>
  );
};

export default RatingsReviewSection;
