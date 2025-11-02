import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import RatingsStar from "../UI/RatingsStar";
import { PlaceCardSkeleton4 } from "../UI/LoaderSkeletons";

const PlaceLoader = () => {
  return (
    <div className="flex gap-4 mx-4">
      <PlaceCardSkeleton4 />
      <PlaceCardSkeleton4 />
      <PlaceCardSkeleton4 />
      <PlaceCardSkeleton4 />
      <PlaceCardSkeleton4 />
    </div>
  );
};

const MarqueeAreas = ({
  places,
  areaTitle,
  areaSubtitle,
  marqueeProps,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full mt-5">
      <header className="flex flex-col items-start gap-3 lg:p-[100px] p-[70px]">
        {areaTitle}
        <p className="font-medium text-xl text-gray-600 mt-1.5">
          {areaSubtitle}
        </p>
      </header>
      <div className="relative w-full flex -mt-12 mb-24">
        {loading ? (
          <PlaceLoader />
        ) : (
          <Marquee {...marqueeProps}>
            {places.map((place, i) => (
              <div
                key={place._id}
                className="card relative group rounded-2xl h-[250px] py-4 px-5 my-12 mx-2 shadow-lg cursor-pointer select-none overflow-clip hover:shadow-xl hover:shadow-gray-500 hover:scale-105 hover:rotate-1 transition duration-300"
                onClick={() =>
                  navigate(`../places/${place._id}`, {
                    state: {
                      Place: place?.Place ?? "",
                      City: place?.City ?? "",
                    },
                  })
                }
              >
                <div
                  className="absolute bottom-0 left-0 w-full h-[200px] bg-blend-screen z-1"
                  style={{
                    background: "linear-gradient(to top, #000, transparent)",
                  }}
                />
                <img
                  src={place.Place_images[0]}
                  alt={place.Place}
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-120 transition-transform duration-300"
                />
                <div className="w-full h-full relative flex items-end justify-between text-white z-2 opacity-90">
                  <div className="flex flex-col">
                    {place.Place_Rating > 0 && (
                      <div className="flex flex-row items-center gap-1">
                        <RatingsStar
                          value={place.Place_Rating}
                          style={{ maxWidth: 85 }}
                        />
                      </div>
                    )}
                    <h3 className="font-extrabold text-2xl w-full truncate">
                      {place.Place}
                    </h3>
                    <div className="flex items-center text-xs gap-1">
                      <i className="fa-solid fa-map-pin text-gray-400" />
                      <span className="font-medium text-indigo-300">
                        {place.City}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 w-[260px] truncate">
                      {place.Place_Desc}
                    </p>
                  </div>
                  <div className="w-[25px] h-[25px] flex items-center justify-center rounded-full border-2 border-indigo-400">
                    <i className="fa fa-arrow-right text-sm text-indigo-400 rotate-45 transition duration-300 group-hover:rotate-0" />
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
};

export default MarqueeAreas;
