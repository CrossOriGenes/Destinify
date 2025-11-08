import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../store/AppContext";
import Modal from "./Modal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LogoutPrompt = ({ onClose }) => {
  const [loadM, setLoadM] = useState(false);
  const { removeAccessToken, setUser, token } = useContext(AppContext);
  const navigate = useNavigate();
  
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
        <div className="w-full flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">Logged out</h3>
          <p className="text-xs text-gray-500 font-medium w-full truncate">
            {result.msg}
          </p>
        </div>
      );
      removeAccessToken();
      setUser({});
      return navigate("/");
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to logout!</p>
      );
      console.error("Something went wrong, try later!", err);
      return;
    } finally {
      setLoadM(false);
      onClose();
    }
  }

  return (
    <Modal onClose={onClose}>
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
              loadM ? "w-40" : "w-20"
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
              <strong className="font-bold text-sm text-white">Yes</strong>
            )}
          </button>
          <button
            type="button"
            className="w-20 h-10 py-2 px-4 flex items-center justify-center border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300 group"
            onClick={onClose}
          >
            <span className="font-bold text-sm text-gray-950 group-hover:text-white">
              Cancel
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutPrompt;
