import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    src: "https://res.cloudinary.com/dtfoedy3u/video/upload/v1755022387/train-travel_isasjo.mp4",
    title: "Railways",
    subtitle: "Through Tracks & Time",
    description:
      "Traveling by train offers a scenic and nostalgic way to explore the heart of a country. Feel the rhythm of the tracks as you glide past villages, rivers, and endless fields — making every moment part of the journey.",
  },
  {
    src: "https://res.cloudinary.com/dtfoedy3u/video/upload/v1755022371/road-travel_vsdqeu.mp4",
    title: "Road Trips",
    subtitle: "Freedom on Four Wheels",
    description:
      "Whether it's highways or hill roads, road trips are the ultimate symbol of travel freedom. Stop where you want, eat local food, and experience places that aren't even marked on the map.",
  },
  {
    src: "https://res.cloudinary.com/dtfoedy3u/video/upload/v1755022397/sea-travel_br3uop.mp4",
    title: "Sea Voyages",
    subtitle: "Sail, Surf & Serenity",
    description:
      "Cruising on vast waters brings peace and excitement all at once. Watch sunsets melt into the horizon and experience life where the sky meets the sea — perfect for soul-searchers and luxury lovers alike.",
  },
  {
    src: "https://res.cloudinary.com/dtfoedy3u/video/upload/v1755022372/hill-travel_dqytwf.mp4",
    title: "Hills & Mountains",
    subtitle: "The Call of the Peaks",
    description:
      "Take a break from city chaos and breathe fresh air in the mountains. With every climb comes a new view, every turn a new memory. Hills are not just destinations — they’re nature’s therapy.",
  },
];

const Hero = () => {
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % SLIDES.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [ready, slide]);

  const handleVideoReady = () => {
    if (videoRef.current) {
      setReady(true);
    }
  };

  const currentSlide = SLIDES[slide];
  return (
    <section
      id="hero"
      className="w-full min-h-[98vh] relative overflow-hidden"
    >
      {SLIDES.map((s, idx) => (
        <video
          key={idx}
          ref={idx === slide ? videoRef : null}
          src={s.src}
          autoPlay
          muted
          loop
          onCanPlay={handleVideoReady}
          className={`video-slide absolute top-0 left-0 w-full h-[98vh] rounded-b-4xl object-cover z-2 ${
            idx === slide ? "active opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute top-0 left-0 w-full h-[98vh] rounded-b-4xl bg-[#17326975]" />
      <div
        className={`relative lg:w-[63%] md:w-[100%] w-full h-screen sm:p-[140px] p-[45px] flex flex-col justify-end z-3 transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-7xl font-extrabold text-white" data-aos="fade-up">
          {currentSlide.title}
        </h1>
        <h5 className="text-lg font-bold tracking-wide text-indigo-800 mt-2 mb-1" data-aos="fade-in">
          {currentSlide.subtitle}
        </h5>
        <p className="text-base font-light tracking-wide leading-6 text-white mt-1 mb-4" data-aos="fade-in">
          {currentSlide.description}
        </p>
        <Link to="" className="btn-dark mt-8 z-2" data-aos="fade-up">
          <span className="uppercase font-semibold tracking-wider text-white">
            Learn More
          </span>
        </Link>
      </div>
      <div className="absolute bottom-10 left-5 flex z-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full mx-1.5 transition duration-300 cursor-pointer ${
              slide === idx ? "bg-indigo-400 scale-150" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-3 float-animate">
        <div className="w-6 h-10 border-2 border-gray-200 rounded-4xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Hero;
