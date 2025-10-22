import { useRef, useState, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ListSkeleton } from "../UI/LoaderSkeletons";
import { AppContext } from "../store/AppContext";
import Menu from "./Menu";
import Wishlist from "./Wishlist";
import Modal from "./Modal";
import LoaderBackdrop from "./LoaderBackdrop";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
  const { user, token, removeAccessToken, setUser } = useContext(AppContext);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [loadM, setLoadM] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeData, setPlaceData] = useState({ Place: "", City: "" });
  const [suggestions, setSuggestions] = useState([]);

  async function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/places/suggest?q=${query}`);
      const result = await res.json();
      setSuggestions(result.suggestions || []);
    } catch (err) {
      if (!fetchedRef.current) {
        toast.error(
          <p className="text-[11px] font-semibold">
            Failed to fetch suggestions!
          </p>
        );
        console.log(err);
        fetchedRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }
  async function searchBarFormHandler(e) {
    e.preventDefault();
    if (!query) return;
    // console.log(query);
    try {
      setLoad(true);
      const res = await fetch(`${BASE_URL}/places/search?p=${query}`);
      const result = await res.json();
      if (res.status === 400 || res.status === 404) {
        toast.error(
          <p className="text-[11px] font-semibold">{result.errMsg}</p>
        );
        return;
      }
      const id = result.id;
      // console.log(id);
      navigate(`../../../places/${id}`, { state: placeData });
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to fetch the data!</p>
      );
      console.error("Something went wrong, try later!", err);
    } finally {
      setLoad(false);
      setQuery("");
    }
  }
  async function logout() {
    try {
      setLoadM(true);
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-white text-[16px]">
              Failed to Logout! ⚠️
            </h3>
            <p className="text-xs text-gray-500 font-medium w-full truncate">
              {result.msg}
            </p>
          </div>
        );
        return;
      }
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">Logged out</h3>
          <p className="text-xs text-gray-500 font-medium w-full truncate">
            {result.msg}
          </p>
        </div>
      );
      removeAccessToken();
      setUser({});
      navigate("../../..");
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to logout!</p>
      );
      console.error("Something went wrong, try later!", err);
    } finally {
      setLoadM(false);
      setOpen("");
    }
  }
  // useEffect(() => {
  //   console.log(token);
  // }, []);

  return (
    <>
      <header className="absolute top-0 left-0 w-full py-3 px-12 flex items-center justify-between z-6 bg-transparent backdrop-blur-sm bg-blend-screen">
        <img
          src="/logo.png"
          alt=""
          className="xl:w-[150px] xl:h-[80px] w-[100px] h-[50px] bg-cover"
        />
        <div className="relative flex items-center gap-3">
          {!id && (
            <div className="relative flex flex-col w-[220px]">
              <form
                onSubmit={searchBarFormHandler}
                className="relative w-full border-2 border-gray-600 rounded-3xl overflow-clip mr-1"
              >
                <input
                  type="text"
                  value={query}
                  className="relative text-sm font-semibold text-gray-950 placeholder:text-gray-600 py-1.5 px-3 outline-none"
                  placeholder="Search by City/Place..."
                  onChange={handleChange}
                  onFocus={() => setFocused(true)}
                />
                <button className="absolute top-0 right-0 w-8 h-8 p-3 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors duration-300 flex justify-center items-center">
                  <i className="fa-solid fa-magnifying-glass text-gray-300 text-sm" />
                </button>
              </form>
              {focused && query && (
                <ul className="absolute w-full min-h-30 top-10 left-0 bg-gray-900 shadow-2xl rounded-2xl z-3 p-2 flex flex-col gap-1.5">
                  {loading && (
                    <>
                      <ListSkeleton />
                      <ListSkeleton />
                      <ListSkeleton />
                    </>
                  )}
                  {!loading &&
                    suggestions.map((sg, idx) => (
                      <li
                        key={idx}
                        className="relative flex flex-col hover:bg-gray-700 py-0.5 px-2 rounded-lg cursor-pointer transition duration-200"
                        onClick={() => {
                          setQuery(sg.Place);
                          setPlaceData({ Place: sg.Place, City: sg.City });
                          setFocused(false);
                        }}
                      >
                        <h5 className="font-bold text-white text-[14px] w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {sg.Place}
                        </h5>
                        <p className="font-medium text-indigo-400 text-xs leading-3">
                          {sg.City}
                        </p>
                      </li>
                    ))}
                  {!loading && suggestions.length === 0 && (
                    <span className="text-lg text-red-400 font-semibold text-center mt-2.5">
                      No match found!
                    </span>
                  )}
                </ul>
              )}
            </div>
          )}
          <div
            className="w-10 h-10 relative rounded-full border-2 border-white overflow-hidden hover:ring-5 hover:ring-gray-700 transition duration-300"
            onClick={() => setOpen("menu")}
          >
            {user ? (
              <img
                src={user?.picture ?? "/images/avatar_default.png"}
                alt=""
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            ) : (
              <img
                src="/images/avatar_default.png"
                alt=""
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            )}
          </div>
          <motion.div
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 700 }}
            className="group flex justify-center items-center w-[35px] h-[35px] cursor-pointer mt-1 -mx-1"
            onClick={() => setOpen("notification_menu")}
          >
            <i className="fa-solid fa-bell text-[21.5px] transition duration-300 text-gray-800 group-hover:text-gray-700" />
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 700 }}
            className="group flex justify-center items-center w-[35px] h-[35px] cursor-pointer hover:bg-[rgba(0,0,0,0.2)] p-2.5 -mx-1 rounded-full"
            onClick={() => setOpen("wishlist")}
          >
            <i className="fa-solid fa-heart text-xl transition duration-300 text-pink-900 group-hover:text-pink-700" />
          </motion.div>

          <AnimatePresence>
            {open === "menu" && (
              <Menu
                onClose={() => setOpen("")}
                openLogoutModal={() => setOpen("logout_prompt")}
              />
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {open === "wishlist" && <Wishlist onClose={() => setOpen("")} />}
      </AnimatePresence>

      <AnimatePresence>
        {open === "logout_prompt" && (
          <Modal onClose={() => setOpen("")}>
            <header className="flex items-center justify-start bg-violet-700 py-1 px-2 rounded-lg">
              <h2 className="text-2xl text-white font-extrabold capitalize pl-1.5">
                Logout?
              </h2>
            </header>
            <div className="flex flex-col p-2">
              <div className="flex items-center mt-1.5 mb-3 gap-2">
                <i className="fa-solid fa-question-circle text-3xl text-blue-400" />
                <p className="text-gray-400 text-md leading-5 mt-2 mb-3">
                  Do you really wish to logout from Destinify?
                </p>
              </div>
              <div className="flex items-end justify-end pt-1.5">
                <button
                  type="button"
                  className={`${
                    loadM ? "w-30" : "w-20"
                  } h-10 py-2 px-4 me-2 flex items-center justify-center bg-gray-950 border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300 group`}
                  onClick={logout}
                >
                  {loadM ? (
                    <>
                      <strong className="font-bold text-xs text-white">
                        Signing Out...
                      </strong>
                      <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
                    </>
                  ) : (
                    <strong className="font-bold text-sm text-white">
                      Yes
                    </strong>
                  )}
                </button>
                <button
                  type="button"
                  className="w-20 h-10 py-2 px-4 flex items-center justify-center border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300 group"
                  onClick={() => setOpen("")}
                >
                  <span className="font-bold text-sm text-gray-950 group-hover:text-white">
                    Cancel
                  </span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>{load && <LoaderBackdrop />}</AnimatePresence>
    </>
  );
};

export default Header;
