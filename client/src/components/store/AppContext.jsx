import { createContext, useReducer, useState, useEffect } from "react";

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
  function addPreferredTheme(val) {
    setPreferredThemes((prev) => {
      const exists = prev.some(
        (t) => t.toLowerCase().trim() === val.toLowerCase().trim()
      );
      if (exists) return prev;
      const updated = [...prev, val];
      localStorage.setItem("preferred_themes", JSON.stringify(updated));
      return updated;
    });
  }
  function addSearchedPlaceToList(placeName) {
    setSearchList((prev) => {
      const exists = prev.some(
        (t) => t.toLowerCase().trim() === placeName.toLowerCase().trim()
      );
      if (exists) return prev;
      const updated = [...prev, placeName];
      localStorage.setItem("search_list", JSON.stringify(updated));
      return updated;
    });
  }
  function setAccessToken(token) {
    setToken(token);
    localStorage.setItem("token", JSON.stringify(token));
  }

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
