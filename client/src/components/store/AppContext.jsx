import { createContext, useReducer, useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const initialState = {
  user: {},
  pageRequestCount: JSON.parse(localStorage.getItem("request_count")) || 1,
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "REMOVE_USER":
      return { ...state, user: {} };

    case "SET_REQUEST":
      return { ...state, pageRequestCount: action.payload };

    case "ADD_TO_WISHLIST":
      if (state.wishlist.find((place) => place.id === action.payload.id))
        return state; // avoid duplicates
      const updatedNewList = [...state.wishlist, action.payload];
      localStorage.setItem("wishlist", JSON.stringify(updatedNewList));
      return { ...state, wishlist: updatedNewList };

    case "REMOVE_FROM_WISHLIST":
      const updatedList = state.wishlist.filter(
        (place) => place.id !== action.payload
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedList));
      return { ...state, wishlist: updatedList };

    case "RESET_REQUEST":
      return { ...state, pageRequestCount: 1 };

    default:
      return state;
  }
};

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [preferredThemes, setPreferredThemes] = useState(
    JSON.parse(localStorage.getItem("preferred_themes")) || []
  );
  const [searchList, setSearchList] = useState(
    JSON.parse(localStorage.getItem("search_list")) || []
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || ""
  );

  function setUser(user) {
    dispatch({ type: "SET_USER", payload: user });
  }
  function removeUser() {
    dispatch({ type: "REMOVE_USER" });
  }
  function addToWishlist(place_data) {
    dispatch({ type: "ADD_TO_WISHLIST", payload: place_data });
  }
  function removeFromWishlist(id) {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  }
  function setRequestCount(cntVal) {
    dispatch({ type: "SET_REQUEST", payload: cntVal });
  }
  function resetRequestCount() {
    dispatch({ type: "RESET_REQUEST" });
  }
  async function addPreferredTheme(val) {
    setPreferredThemes((prev) => {
      const exists = prev.some(
        (t) => t.toLowerCase().trim() === val.toLowerCase().trim()
      );
      if (exists) return prev;
      const updated = [...prev, val];
      localStorage.setItem("preferred_themes", JSON.stringify(updated));
      return updated;
    });
    if (token) {
      try {
        // console.log(110, val)
        const res = await fetch(`${BASE_URL}/users/update_preferred_themes`, {
          method: "POST",
          body: JSON.stringify({ category: val }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data.msg);
      } catch (e) {
        console.error("Failed to update search list! ", e);
        return;
      }
    }
  }
  async function addSearchedPlaceToList(placeName) {
    setSearchList((prev) => {
      const exists = prev.some(
        (t) => t.toLowerCase().trim() === placeName.toLowerCase().trim()
      );
      if (exists) return prev;
      const updated = [...prev, placeName];
      localStorage.setItem("search_list", JSON.stringify(updated));
      return updated;
    });
    if (token) {
      try {
        // console.log(110, placeName)
        const res = await fetch(`${BASE_URL}/users/update_searchlist`, {
          method: "POST",
          body: JSON.stringify({ placename: placeName }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data.msg);
      } catch (e) {
        console.error("Failed to update search list! ", e);
        return;
      }
    }
  }
  function setAccessToken(token) {
    setToken(token);
    localStorage.setItem("token", JSON.stringify(token));
  }
  function removeAccessToken() {
    setToken(null);
    localStorage.removeItem("token");
  }
  async function getUserData(token) {
    try {
      const res = await fetch(`${BASE_URL}/users/get_user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("User data fetched successfully.✔️");
        console.log(data);
        const { _id, username, email, picture } = data.user;
        setUser({
          id: _id,
          username,
          email,
          picture: picture ? picture : null,
        });
        if (!JSON.parse(localStorage.getItem("preferred_themes"))) {
          localStorage.setItem(
            "preferred_themes",
            JSON.stringify(data.user.preferred_themes)
          );
          console.log("preferred themes set to localstorage");
        }
        if (!JSON.parse(localStorage.getItem("search_list"))) {
          localStorage.setItem(
            "search_list",
            JSON.stringify(data.user.recent_searches)
          );
          console.log("search list set to localstorage");
        }
        if (!JSON.parse(localStorage.getItem("wishlist"))) {
          localStorage.setItem("wishlist", JSON.stringify(data.user.wishlist));
          console.log("wishlist set to localstorage");
        }
      } else {
        console.log("User data not found due to token issues.❌ \n", data);
        setUser({});
      }
    } catch (err) {
      console.error("Failed to fetch user data!", err);
      return;
    }
  }
  useEffect(() => {
    if (!token) return;
    getUserData(token);
  }, [window.location.pathname]);

  return (
    <AppContext.Provider
      value={{
        user: state.user,
        pageReqCnt: state.pageRequestCount,
        wishlist: state.wishlist,
        preferredThemes,
        searchList,
        token,
        setUser,
        setRequestCount,
        setAccessToken,
        removeAccessToken,
        addToWishlist,
        removeFromWishlist,
        removeUser,
        resetRequestCount,
        addPreferredTheme,
        addSearchedPlaceToList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
