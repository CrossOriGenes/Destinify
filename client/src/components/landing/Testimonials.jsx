import { useRef, useState, useEffect } from "react";
import RatingsStar from "../UI/RatingsStar";

const REVIEWS = [
  {
    profile_pic: "/images/user2.jpg",
    comments:
      "Exceptional service, stunning locations, unforgettable views & memories. Thank you for making our honeymoon plan suggestions magical!",
    username: "Esha Parui",
    designation: "Newlyweds",
    ratings: 4.5,
  },
  {
    profile_pic: "/images/user3.jpg",
    comments:
      "The one-stop solution to quickest trip-finder. With the next-gen AI enhancibility Destinify is the best trip-suggestor of all!",
    username: "Snehodipto Das",
    designation: "Enterprenuer",
    ratings: 5,
  },
  {
    profile_pic: "/images/user4.jpg",
    comments:
      "Nothing could have been more suggestive about hiking facilities. Just loved it!",
    username: "Somnath Sen",
    designation: "Mountaineer",
    ratings: 4,
  },
  {
    profile_pic: "/images/user4.jpg",
    comments:
      "The best platform to suggest for both budget & event optimized tour plans. UI is so smooth like butter!",
    username: "Anibrata Khan",
    designation: "Travel Enthusiast",
    ratings: 4.5,
  },
  {
    profile_pic: "/images/user5.jpg",
    comments:
      "A dream come true! Every detail was perfectly arranged. Highly recommend Destinify",
    username: "Riya Seth",
    designation: "Solo traveller",
    ratings: 4.2,
  },
  {
    profile_pic: "/images/user6.jpg",
    comments:
      "Exceptional guidance, budget friendly suggestions & sight-seeing maps. The best elaborated guide ever!",
    username: "Amy Schwarzzenegger",
    designation: "Photographer",
    ratings: 5,
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (container && container.firstChild) {
      setCardWidth(container.firstChild.offsetWidth + 16); 
    }

    const interval = setInterval(() => {
      if (container) {
        container.scrollLeft += cardWidth;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollLeft = 0;
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [cardWidth]);

  function handleScroll(dir) {
    const container = scrollRef.current;
    if (container) {
      container.scrollLeft += dir * cardWidth;
    }
  }

  return (
    <section id="testimonial" className="relative w-full min-h-screen bg-gray-900 overflow-hidden">
      <div className="absolute -top-20 -left-40 w-[1000px] h-[900px] bg-[url('/images/mountain-1.png')] bg-cover z-0">
        <div className="absolute top-30 right-25 w-[137px] h-[200px] bg-[url('/images/paper-plane-flow-2.png')] bg-cover bg-center z-1 rotate-25 opacity-85" />
      </div>
      <div className="absolute top-0 right-0 h-full py-[100px] px-[140px] xl:w-[70%] w-full flex flex-col">
        <div className="w-full me-4 text-right">
          <h1 className="font-extrabold capitalize text-[65px] text-white pb-3">
            what our&nbsp;
            <span className="text-indigo-500">travellers say</span>
          </h1>
          <p className="font-semibold text-gray-500 text-md leading-5 mb-6">
            From serene mountain treks and exotic wildlife safaris to
            architectural wonders and colourful festivals, every journey with us
            is an invitation to reconnect with the world, and yourself.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar my-7 z-3"
        >
          {REVIEWS.map((_, idx) => (
            <div
              key={idx}
              className="card relative xl:min-w-[calc(50%-0.5em)] min-w-full h-[210px] bg-[rgba(225,225,225,0.2)] border-1 border-cyan-400 p-6"
            >
              <div className="absolute top-0 right-0 border-dashed border-t-4 border-r-4 border-teal-300 w-1/2 h-30 rounded-tr-[8px]" />
              <i className="fa-solid fa-quote-left absolute top-0 left-0 text-white text-9xl opacity-25" />
              <div className="relative w-full h-full flex flex-col items-start justify-between">
                <div className="flex flex-col">
                  <RatingsStar value={_.ratings} style={{ maxWidth: 95 }} />
                  <p className="text-gray-200 font-medium text-[14.2px] leading-4 mt-2">
                    {_.comments}
                  </p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <img
                    src={_.profile_pic}
                    alt=""
                    className="w-12 h-12 bg-cover rounded-full"
                  />
                  <div className="flex flex-col leading-3 text-right">
                    <h4 className="font-extrabold text-white text-lg">
                      {_.username}
                    </h4>
                    <h6 className="font-medium text-[10px] text-wrap text-indigo-300 uppercase tracking-[2px]">
                      {_.designation}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="relative flex justify-end mt-4">
          <button
            type="button"
            className="group flex items-center justify-center w-9 h-9 mx-1.5 border-2 border-gray-400 rounded-full hover:bg-gray-400 transition duration-300"
            onClick={() => handleScroll(-1)}
          >
            <i className="fas fa-arrow-left group-hover:text-gray-900 text-gray-400 text-lg" />
          </button>
          <button
            type="button"
            className="group flex items-center justify-center w-9 h-9 mx-1.5 border-2 border-gray-400 rounded-full hover:bg-gray-400 transition duration-300"
            onClick={() => handleScroll(1)}
          >
            <i className="fas fa-arrow-right group-hover:text-gray-900 text-gray-400 text-lg" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
