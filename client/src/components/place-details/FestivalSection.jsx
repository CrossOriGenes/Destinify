import { motion } from "framer-motion";

const FestivalSection = ({ festivals, onAddToWishlist, isLoading }) => {
  // useEffect(() => {
  //   console.log(festivals);
  // }, [festivals]);
  return (
    <section
      id="festivals"
      className="relative col-span-4 xl:p-[120px] p-[70px] min-h-screen bg-gray-950 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-gray-500 font-medium lg:text-lg text-sm">
          Each and every place on the earth possess an unique and undiscovered
          story! From destinify we bring you the best places, festivals, events,
          dishes or even celebrities famous from this place...
        </p>
        <h2 className="text-right lg:text-5xl text-5xl font-extrabold text-wrap text-white lg:leading-12 leading-10 ml-12">
          Sneak<span className="text-indigo-500 text-7xl"> Peeks</span>
        </h2>
      </div>
      <div className="relative w-full flex flex-col mt-8">
        {festivals.map((fest, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row ${
              idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
            } items-center gap-10 my-8`}
          >
            <div className="lg:w-1/2 w-full overflow-hidden mx-6 rounded-xl shadow-md">
              <img
                src={fest?.image ?? null}
                alt={fest?.title ?? ""}
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="lg:w-1/2 w-full mx-6 px-4">
              <h3 className="text-4xl font-extrabold text-gray-300 mb-1">
                {fest?.title ?? ""}
              </h3>
              <p className="text-gray-600 font-medium leading-5 text-lg mt-3 -mb-3">
                {fest?.description ?? ""}
              </p>
              <br />
              📍
              <span className="text-cyan-300 text-xs">{fest?.place ?? ""}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="w-full flex items-center justify-between mt-16 px-20">
        <div className="flex flex-col">
          <h4 className="text-2xl font-bold text-indigo-300 mb-2">
            Like this place?
          </h4>
          <p className="text-gray-500 leading-5">
            Add this place to your favlist so that you can get a direct glimpse
            of the place at your hands or, Share your reviews if you have
            already traveled here-
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 ml-18">
          <button
            type="button"
            className="group btn2 w-[200px] py-[25px] rounded-4xl"
          >
            <i className="fa-solid fa-comment text-lg text-pink-700 mr-1.5" />
            <span className="font-semibold group-hover:text-gray-200 text-sm capitalize">
              Post a comment
            </span>
          </button>
          <button
            type="button"
            className="btn z-2 flex items-center justify-center"
            onClick={onAddToWishlist}
          >
            {isLoading ? (
              <>
                <strong className="font-semibold text-white text-sm">
                  Adding...
                </strong>
                <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
              </>
            ) : (
              <strong className="font-semibold text-white text-sm">
                Add to Favlist
              </strong>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FestivalSection;
