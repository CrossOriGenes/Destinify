import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RatingStarSticker, RatingsStarBox } from "../UI/RatingsStar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// const RATINGS = [
//   { rating_label: "Climate", rating_val: 4.5 },
//   { rating_label: "Hotels", rating_val: 4.5 },
//   { rating_label: "Budget", rating_val: 2.5 },
//   { rating_label: "Transportation", rating_val: 4 },
//   { rating_label: "Sight-seeing", rating_val: 4.5 },
//   { rating_label: "Food & water", rating_val: 5 },
// ];
// const REVIEWS = [
//   {
//     id: 1,
//     text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//     user: "John Doe",
//     avatar: "/images/user4.jpg",
//     rating: 4,
//   },
//   {
//     id: 2,
//     text: "Amazing place with great sightseeing and food options!",
//     user: "Emily Johnson",
//     avatar: "/images/user5.jpg",
//     rating: 5,
//   },
//   {
//     id: 3,
//     text: "Budget-friendly destination, loved the climate and people.",
//     user: "Alyx Brown",
//     avatar: "/images/user6.jpg",
//     rating: 4.5,
//   },
// ];

const RatingsReviewSection = ({ reviews, ratings, overallRating }) => {
  // useEffect(() => {
  //   console.log("Updated reviews state: ", reviews);
  // }, [reviews]);

  return (
    <section
      id="ratings"
      className="relative col-span-4 xl:p-[120px] p-[70px] min-h-screen bg-gray-300 overflow-clip"
    >
      <div className="absolute top-9 left-9 w-[160px] h-[160px] rounded-b-full bg-[url('/images/dots.png')] bg-cover bg-center rotation-animate" />
      <h1 className="text-6xl font-extrabold w-full text-center -mt-2 mb-5">
        Ratings and <span className="text-indigo-500">Reviews</span>
      </h1>
      <div className="relative w-full flex lg:flex-row flex-col mt-15 mb-15">
        <div className="lg:w-[50%] w-full mt-6">
          <h5
            className="text-xl font-bold my-1.5 text-gray-800"
            data-aos="fade-right"
          >
            Overall Rating
          </h5>
          <div className="flex items-end gap-2" data-aos="fade-in">
            <RatingsStarBox
              style={{ maxWidth: 300 }}
              value={overallRating}
              className="box-rating"
            />
            <span
              className="font-bold text-gray-500 text-lg -mb-1"
              data-aos="fade-left"
            >
              {overallRating}/5
            </span>
          </div>
          <ul className="relative grid lg:grid-cols-2 grid-cols-1 mt-15 gap-6">
            {Object.entries(ratings).map(([categ, val], idx) => (
              <li key={categ} className="flex flex-col h-12 me-2.5">
                <span className="font-semibold text-sm text-gray-700 -mb-2.5">
                  {categ}
                </span>
                <div className="inline-flex items-end justify-between">
                  <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(val / 5) * 100}%` }}
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
                    {val}
                  </motion.strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative lg:w-[50%] w-full lg:pl-30 lg:py-10 py-20">
          {reviews.length > 0 ? (
            <>
              <i className="fa-solid fa-quote-left absolute lg:-top-4 -top-10 left-15 text-[9rem] opacity-20" />
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 7000,
                  disableOnInteraction: false,
                }}
                navigation={true}
                className="w-full h-full relative"
              >
                {reviews.map((rev, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative flex flex-col justify-between gap-6 lg:mt-0 mt-6 select-none">
                      <p className="font-medium h-[200px] text-ellipsis text-lg italic leading-5 overflow-hidden">
                        {rev?.text ?? ""}
                      </p>
                      <div className="w-full flex items-center justify-center gap-3">
                        <img
                          src={rev?.profile_photo ?? ""}
                          alt=""
                          className="w-10 h-10 rounded-full bg-cover bg-no-repeat object-cover"
                        />
                        <div className="flex flex-col">
                          <h4 className="font-extrabold uppercase tracking-wider text-sm">
                            {rev?.author ?? ""}
                          </h4>
                          <RatingStarSticker
                            style={{ maxWidth: 80 }}
                            value={rev?.rating ?? 0}
                          />
                          <span className="text-xs italic">
                            ({rev?.time ?? ""})
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <div className="w-full text-center">
              <p className="font-semibold text-xl text-gray-800">
                No reviews available!
              </p>
            </div>
          )}
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] bg-blend-screen"
        style={{
          background: "linear-gradient(to top, #1e2939, transparent)",
        }}
      />
    </section>
  );
};

export default RatingsReviewSection;
