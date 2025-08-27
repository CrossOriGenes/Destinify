import { RatingsStarBox } from "../UI/RatingsStar";

const RatingsReviewSection = () => {
  return (
    <section
      id="place-descr-ratings"
      className="col-span-4 xl:px-[120px] p-[70px] min-h-screen bg-gray-300"
    >
      <h1 className="text-6xl font-extrabold w-full text-center mt-2 mb-4">
        Ratings and <span className="text-indigo-500">Reviews</span>
      </h1>
      <div className="relative flex lg:flex-row flex-col mt-15">
        <div className="lg:w-[50%] w-full mt-6">
          <h5 className="text-xl font-bold my-1.5 text-gray-800">
            Overall Rating
          </h5>
          <div className="flex items-end gap-2">
            <RatingsStarBox
              style={{ maxWidth: 300 }}
              value={4.5}
              className="box-rating"
            />
            <span className="font-bold text-gray-500 text-lg -mb-1">4.5/5</span>
          </div>
          <ul className="relative grid lg:grid-cols-2 grid-cols-1 mt-15 gap-6">
            <li className="flex flex-col h-12 me-2.5">
              <span className="font-semibold text-sm text-gray-700 -mb-2.5">Climate</span>
              <div className="inline-flex items-end justify-between">
                <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                  <div
                    className="absolute h-full top-0 left-0 bg-cyan-700 rounded-2xl"
                    style={{ width: `${(4.5 / 5) * 100}%` }}
                  />
                </div>
                <strong className="text-lg -mb-1.5 ml-2.5">4.5</strong>
              </div>
            </li>
            <li className="flex flex-col h-12 ml-2.5">
              <span className="font-semibold text-sm text-gray-700 -mb-2.5">Hotels</span>
              <div className="inline-flex items-end justify-between">
                <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                  <div
                    className="absolute h-full top-0 left-0 bg-cyan-700 rounded-2xl"
                    style={{ width: `${(4.5 / 5) * 100}%` }}
                  />
                </div>
                <strong className="text-lg -mb-1.5 ml-2.5">4.5</strong>
              </div>
            </li>
            <li className="flex flex-col h-12 me-2.5">
              <span className="font-semibold text-sm text-gray-700 -mb-2.5">Budget</span>
              <div className="inline-flex items-end justify-between">
                <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                  <div
                    className="absolute h-full top-0 left-0 bg-cyan-700 rounded-2xl"
                    style={{ width: `${(2.5 / 5) * 100}%` }}
                  />
                </div>
                <strong className="text-lg -mb-1.5 ml-2.5">2.5</strong>
              </div>
            </li>
            <li className="flex flex-col h-12 ml-2.5">
              <span className="font-semibold text-sm text-gray-700 -mb-2.5">Transportation</span>
              <div className="inline-flex items-end justify-between">
                <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                  <div
                    className="absolute h-full top-0 left-0 bg-cyan-700 rounded-2xl"
                    style={{ width: `${(4 / 5) * 100}%` }}
                  />
                </div>
                <strong className="text-lg -mb-1.5 ml-2.5">4</strong>
              </div>
            </li>
            <li className="flex flex-col h-12 me-2.5">
              <span className="font-semibold text-sm text-gray-700 -mb-2.5">Sight-seeing</span>
              <div className="inline-flex items-end justify-between">
                <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                  <div
                    className="absolute h-full top-0 left-0 bg-cyan-700 rounded-2xl"
                    style={{ width: `${(4.5 / 5) * 100}%` }}
                  />
                </div>
                <strong className="text-lg -mb-1.5 ml-2.5">4.5</strong>
              </div>
            </li>
            <li className="flex flex-col h-12 ml-2.5">
              <span className="font-semibold text-sm text-gray-700 -mb-2.5">Food & water</span>
              <div className="inline-flex items-end justify-between">
                <div className="relative w-[90%] h-2.5 bg-gray-400 rounded-2xl overflow-hidden">
                  <div
                    className="absolute h-full top-0 left-0 bg-cyan-700 rounded-2xl"
                    style={{ width: `${(5 / 5) * 100}%` }}
                  />
                </div>
                <strong className="text-lg -mb-1.5 ml-2.5">5</strong>
              </div>
            </li>
          </ul>
        </div>
        <div className="lg:w-[50%] w-full"></div>
      </div>
    </section>
  );
};

export default RatingsReviewSection;
