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
  const fetchedRef2 = useRef(false);
  const [places, setPlaces] = useState([]);
  const [places2, setPlaces2] = useState([]);
  const [isLoading, setLoading] = useState(0);

  async function getAIRecommendedPlaces() {
    //   console.log(user.age, preferredThemes);
    try {
      setLoading(1);
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
        console.warn(`${result.msg},\n ${result.description}`);
        return;
      }
      setPlaces(result.places);
      console.log(result.msg);
      // console.log(result);
    } catch (err) {
      console.error("Failed to fetch place recommendations from AI!\n", err);
      return;
    } finally {
      setLoading(0);
    }
  }
  async function getSearchHistoryBasedPlaces() {
    // console.log(searchList);
    try {
      setLoading(2);
      const res = await fetch(`${BASE_URL}/users/revisit_searched_places`, {
        method: "POST",
        body: JSON.stringify({ search_history: searchList }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.status === 400) {
        console.warn(result.errMsg);
        return;
      }
      setPlaces2(result.places);
      console.log(result.msg);
    } catch (err) {
      console.error(
        "Failed to fetch place recommendations from search-history!\n",
        err
      );
      return;
    } finally {
      setLoading(0);
    }
  }
  useEffect(() => {
    if (preferredThemes.length > 0 && !fetchedRef1.current) {
      getAIRecommendedPlaces();
      fetchedRef1.current = true;
    }

    if (searchList.length > 0 && !fetchedRef2.current) {
      getSearchHistoryBasedPlaces();
      fetchedRef2.current = true;
    }
  }, []);

  return (
    <section
      id="quickies-2"
      className="relative w-full min-h-screen overflow-hidden bg-gray-950"
    >
      {/* place recommendations from travellers choices */}
      <MarqueeAreas
        key="recommendations_list_1"
        places={places}
        loading={isLoading === 1}
        areaTitle={
          <h1 className="text-white font-extrabold text-5xl w-sm text-wrap leading-12">
            Travellers{" "}
            <span className="text-indigo-500 text-7xl">Recommendations</span>
          </h1>
        }
        areaSubtitle="Places recommended for you from fellow travellers:"
        marqueeProps={{
          speed: 25,
          pauseOnHover: true,
        }}
      />

      {/* place recommendations from user's search-history */}
      <MarqueeAreas
        key="recommendations_list_2"
        places={places2}
        loading={isLoading === 2}
        areaTitle={
          <h1 className="text-white font-extrabold text-7xl w-sm text-wrap leading-12 -mt-20">
            Visit <span className="text-indigo-500">Again</span>
          </h1>
        }
        areaSubtitle="Suggestions on places based on your recent searches:"
        marqueeProps={{
          speed: 25,
          pauseOnHover: true,
          direction: "right",
        }}
      />
    </section>
  );
};

export default Quickies2;
