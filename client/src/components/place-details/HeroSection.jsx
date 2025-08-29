const HeroSection = () => {
  return (
    <section
      id="place-details-hero"
      className="relative col-span-4 min-h-screen overflow-hidden"
    >
      <div className="relative w-full h-[95vh] overflow-hidden clip-hero-img">
        <img
          src="/images/Udaipur.jpg"
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover bg-no-repeat"
        />
        <div className="absolute w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.3)] z-1" />
        <div className="relative w-full h-full lg:p-[100px] p-[50px] flex flex-col items-start justify-end select-none -mt-12 z-2">
          <h1
            className="xl:text-9xl lg:text-8xl text-[82px] text-white font-extrabold xl:mb-1 -mb-2 text-shadow-sm"
            data-aos="fade-up"
          >
            Udaipur
          </h1>
          <h5
            className="text-xl text-indigo-200 font-semibold"
            data-aos="fade-in"
          >
            <i className="fa-solid fa-location-dot text-md text-gray-400 ml-3 me-1" />
            Rajasthan, India
          </h5>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
