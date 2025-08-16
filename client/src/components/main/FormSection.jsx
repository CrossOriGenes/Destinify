import PlaceSuggestionForm from "../landing/PlaceSuggestionForm";

const FormSection = () => {
  function getSuggestivePlacesHandler(journeyData) {
    console.log(journeyData);
  }

  return (
    <section className="w-full min-h-screen relative p-[100px] bg-gray-900 overflow-hidden">
      <div className="absolute top-40 right-30 w-[250px] h-[250px] rounded-b-full bg-[url('/images/dots.png')] bg-cover bg-center rotation-animate invert-100 opacity-55" />
      <div
        className="absolute bottom-0 left-0 w-full h-[100px] bg-blend-screen z-5"
        style={{ background: "linear-gradient(to top, #1E2939, transparent)" }}
      />
      <div className="flex flex-col w-full text-center">
        <h1 className="capitalize text-white" data-aos="fade-up">
          Find your <span className="text-indigo-500">next trip</span>
        </h1>
        <p className="text-gray-400 mt-4" data-aos="fade-in">
          Thrive into our vast ocean of personalized tour-guides. Provide your
          journey dates, time and place preference and let us provide you with
          your dream package from our generative-AI model suggestion provider
          exactly based on your requirements.
        </p>
      </div>
      <div className="relative xl:mx-12 lg:mx-6 -mx-24 mt-35 mb-25">
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
                Just provide your holiday requirements & let us do rest to give
                you the best suggestive tourable places possible just with a
                button click!
              </p>
            </div>
            <div
              className="relative flex flex-col pl-2.5 pe-0 w-full md:w-[60%]"
              data-aos="fade-right"
            >
              <PlaceSuggestionForm onSubmitData={getSuggestivePlacesHandler} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormSection;
