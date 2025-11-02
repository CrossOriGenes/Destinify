import { useState, useEffect, useRef, useContext } from "react";
import MarqueeAreas from "./MarqueeAreas";
import { toast } from "react-toastify";
import { AppContext } from "../store/AppContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const PLACES = [
//   {
//     Place: "Place 1",
//     Place_images: ["/images/Udaipur.jpg"],
//     City: "Udaipur",
//     Place_Desc: "Romantic lakes & regal palaces.",
//     Place_Rating: 4,
//   },
//   {
//     Place: "Place 2",
//     Place_images: ["/images/Odisha.jpg"],
//     City: "Odisha",
//     Place_Desc: "Spiritual vibes & historic treasures.",
//     Place_Rating: 4.5,
//   },
//   {
//     Place: "Place 3",
//     Place_images: ["/images/Punjab.jpg"],
//     City: "Punjab",
//     Place_Desc: "Where tradition meets vibrant hospitality.",
//     Place_Rating: 4,
//   },
//   {
//     Place: "Place 4",
//     Place_images: ["/images/Goa.jpg"],
//     City: "Goa",
//     Place_Desc: "Sun, sand & soul soothing vibes.",
//     Place_Rating: 3.5,
//   },
//   {
//     Place: "Place 5",
//     Place_images: ["/images/Sikkim.jpg"],
//     City: "Sikkim",
//     Place_Desc: "Serenity in every snow-capped peak.",
//     Place_Rating: 5,
//   },
//   {
//     Place: "Place 6",
//     Place_images: ["/images/Kerala.jpg"],
//     City: "Kerala",
//     Place_Desc: "The beauty of the God's-own country.",
//     Place_Rating: 4.5,
//   },
//   {
//     Place: "Place 7",
//     Place_images: ["/images/Punjab.jpg"],
//     City: "Punjab",
//     Place_Desc: "Where tradition meets vibrant hospitality.",
//     Place_Rating: 4,
//   },
//   {
//     Place: "Place 8",
//     Place_images: ["/images/Goa.jpg"],
//     City: "Goa",
//     Place_Desc: "Sun, sand & soul soothing vibes.",
//     Place_Rating: 3.5,
//   },
//   {
//     Place: "Place 9",
//     Place_images: ["/images/Sikkim.jpg"],
//     City: "Sikkim",
//     Place_Desc: "Serenity in every snow-capped peak.",
//     Place_Rating: 5,
//   },
//   {
//     Place: "Place 10",
//     Place_images: ["/images/Kerala.jpg"],
//     City: "Kerala",
//     Place_Desc: "The beauty of the God's-own country.",
//     Place_Rating: 4.5,
//   },
// ];

const Quickies2 = () => {
  const { preferredThemes, searchList, user } = useContext(AppContext);
  const fetchedRef1 = useRef(false);
  const [places, setPlaces] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function getAIRecommendedPlaces() {
    //   console.log(user.age, preferredThemes);
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/suggest_place_from_model`, {
        method: "POST",
        body: JSON.stringify({
          age: user.age,
          preferred_themes: preferredThemes,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();

      if (res.status === 400) {
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-red-100 text-[16px]">{result.msg}</h3>
            <p className="text-xs text-red-500 font-medium leading-3 mt-1.5">
              {result.description}
            </p>
          </div>
        );
        return;
      }
      setPlaces(result.places);
      console.log(result.msg);
      //   console.log(result);
    } catch (err) {
      console.error("Failed to fetch place recommendations from AI!\n", err);
      return;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (
      preferredThemes.length > 0 &&
      searchList.length > 0 &&
      !fetchedRef1.current
    ) {
      getAIRecommendedPlaces();
      fetchedRef1.current = true;
    }
  }, []);

  return (
    <section
      id="quickies-2"
      className="relative w-full min-h-screen overflow-hidden bg-gray-950"
    >
      {/* place recommendations from travellers choices */}
      <MarqueeAreas
        places={places}
        loading={isLoading}
        areaTitle={
          <h1 className="text-white font-extrabold text-7xl w-sm text-wrap leading-20">
            Travellers{" "}
            <span className="text-indigo-500 text-[88px]">Recommendations</span>
          </h1>
        }
        areaSubtitle="Places recommended for you from fellow travellers:"
        marqueeProps={{
          speed: 50,
          pauseOnHover: true,
        }}
      />
    </section>
  );
};

export default Quickies2;
