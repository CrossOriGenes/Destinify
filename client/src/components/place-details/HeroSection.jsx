import React from "react";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="relative w-full h-full">
        <img
          src="/images/Udaipur.jpg"
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
