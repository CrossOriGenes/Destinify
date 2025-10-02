import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";

const initialState = {
  user: {},
  pageRequestCount: 0,
  wishlist: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "INCREMENT_REQUEST":
      return { ...state, pageRequestCount: state.pageRequestCount + 1 };

    case "ADD_TO_WISHLIST":
      if (state.wishlist.find((place) => place.id === action.payload.id)) {
        return state; // avoid duplicates
      }
      return { ...state, wishlist: [...state.wishlist, action.payload] };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((place) => place.id !== action.payload),
      };

    default:
      return state;
  }
};

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Action helpers
  const setUser = (user) => dispatch({ type: "SET_USER", payload: user });
  const incrementRequest = () => dispatch({ type: "INCREMENT_REQUEST" });
  const addToWishlist = (place) =>
    dispatch({ type: "ADD_TO_WISHLIST", payload: place });
  const removeFromWishlist = (id) =>
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });

  return (
    <AppContext.Provider
      value={{
        user: state.user,
        pageRequestCount: state.pageRequestCount,
        wishlist: state.wishlist,
        setUser,
        incrementRequest,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
