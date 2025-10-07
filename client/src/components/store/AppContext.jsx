import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";

const initialState = {
  user: {},
  pageRequestCount: 1,
  wishlist: [],
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
      if (state.wishlist.find((place) => place.id === action.payload.id)) {
        return state; // avoid duplicates
      }
      return { ...state, wishlist: [...state.wishlist, action.payload] };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((place) => place.id !== action.payload),
      };

    case "RESET_REQUEST":
      return { ...state, pageRequestCount: 1 };

    default:
      return state;
  }
};

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  // const [user, setUser] = useState(null);
  // const [cnt, setCnt] = useState(1);
  const setUser = (user) => dispatch({ type: "SET_USER", payload: user });
  const removeUser = () => dispatch({ type: "REMOVE_USER" });
  const addToWishlist = (id) =>
    dispatch({ type: "ADD_TO_WISHLIST", payload: id });
  const removeFromWishlist = (id) =>
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  const setRequestCount = (cntVal) =>
    dispatch({ type: "SET_REQUEST", payload: cntVal });
  const resetRequestCount = () => dispatch({ type: "RESET_REQUEST" });

  return (
    <AppContext.Provider
      value={{
        user: state.user,
        pageReqCnt: state.pageRequestCount,
        wishlist: state.wishlist,
        setUser,
        setRequestCount,
        addToWishlist,
        removeFromWishlist,
        removeUser,
        resetRequestCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
