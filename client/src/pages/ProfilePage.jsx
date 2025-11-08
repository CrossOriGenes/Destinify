import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../components/store/AppContext";
import Modal from "../components/UI/Modal";
import Wishlist from "../components/UI/Wishlist";
import ProfileSection from "../components/user-profile/ProfileSection";
import VerifyOTPModal from "../components/user-profile/VerifyOTPModal";
import LogoutPrompt from "../components/UI/LogoutPrompt";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isToggled, setToggle] = useState(false);
  const [openNavs, setOpenNavs] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingM, setLoadM] = useState(false);
  const [err, setErr] = useState(null);
  const { token, removeAccessToken, removeUser } = useContext(AppContext);
  const navigate = useNavigate();

  const updateUserDataHandler = async (updatableData) => {
    const { userData, file } = updatableData;
    // console.log(userData, file);
    const formData = new FormData();
    Object.entries(userData).forEach(([key, val]) => {
      formData.append(key, val);
    });
    if (file) formData.append("image", file);

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/update_user`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (res.status === 400) {
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-red-50 text-[16px]">
              {result.errMsg}
            </h3>
            <p className="text-xs text-red-500 font-medium">
              {result.description}
            </p>
          </div>
        );
        return;
      }
      if (res.status === 201) {
        toast.info(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-blue-50 text-[16px]">
              {result.message}
            </h3>
            <p className="text-xs text-blue-500 font-medium">
              You have not changed any data for updation.
            </p>
          </div>
        );
        return;
      }
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-blue-50 text-lg">{result.msg}</h3>
          <p className="text-xs text-gray-500 font-medium leading-3 mt-[3px]">
            {result.description}
          </p>
        </div>
      );
      // console.log(result);
    } catch (err) {
      toast.error(
        <p className="text-[12px] text-red-50 font-medium">
          Failed to update data!
        </p>
      );
      console.error("Something went wrong!\n", err);
      return;
    } finally {
      setLoading(false);
    }
  };
  const openVerificationModal = async () => {
    try {
      setLoadM(true);
      const res = await fetch(`${BASE_URL}/auth/generate_otp_v2`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-red-50 text-[16px]">
              {result.errMsg || "Failed to send OTP!"}
            </h3>
            <p className="text-xs text-red-500 font-medium">
              {result.description ||
                "Failed to send verification OTP to mail, Please try again later."}
            </p>
          </div>
        );
        return;
      }
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-blue-50 text-lg">{result.msg}</h3>
          <p className="text-xs text-gray-500 font-medium leading-3 mt-[3px]">
            {result.description}
          </p>
        </div>
      );
      // console.log(result);
    } catch (e) {
      toast.error(
        <p className="text-[12px] font-medium text-red-200">
          Failed to send verification OTP!
        </p>
      );
      console.error("Something went wrong!\n", e);
    } finally {
      setLoadM(false);
      setOpen(false);
      setOpen2(true);
    }
  };
  const deleteUserHandler = async (enteredOTP) => {
    // console.log("Entered OTP: ", enteredOTP);
    try {
      setLoadM(true);
      const res = await fetch(
        `${BASE_URL}/users/delete_user?otp=${enteredOTP}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (res.status === 400) {
        setErr(result.description);
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-red-50 text-lg">{result.msg}</h3>
            <p className="text-xs text-red-500 font-medium leading-3 mt-2">
              {result.description}
            </p>
          </div>
        );
        return;
      }
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-blue-50 text-lg">{result.msg}</h3>
          <p className="text-xs text-gray-500 font-medium leading-3 mt-[3px]">
            {result.description}
          </p>
        </div>
      );
      setOpen2(false);
      // console.log(result);
      removeAccessToken();
      removeUser();
      navigate("/");
    } catch (e) {
      toast.error(
        <p className="text-[12px] font-medium text-red-200">
          Failed to remove user's Account!
        </p>
      );
      console.error("Something went wrong!\n", e);
    } finally {
      setLoadM(false);
    }
  };

  return (
    <>
      <main className="w-full relative overflow-hidden">
        <header className="relative w-full py-3 px-12 flex items-center justify-between z-6 bg-gray-900 backdrop-blur-sm bg-blend-screen">
          <img
            src="/logo.png"
            alt=""
            className="xl:w-[150px] xl:h-[80px] w-[100px] h-[50px] bg-cover"
          />
          <div className="relative flex items-center gap-3">
            <motion.div
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 700 }}
              className="group flex justify-center items-center w-[35px] h-[35px] cursor-pointer mt-1 -mx-1"
              onClick={() => setOpen("notification_menu")}
            >
              <i className="fa-solid fa-bell text-[21.5px] transition duration-300 text-gray-600 group-hover:text-gray-500" />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 700 }}
              className="group flex justify-center items-center w-[35px] h-[35px] cursor-pointer hover:bg-[rgba(0,0,0,0.2)] p-2.5 -mx-1 rounded-full"
              onClick={() => setOpenNavs("wishlist")}
            >
              <i className="fa-solid fa-heart text-xl transition duration-300 text-pink-900 group-hover:text-pink-700" />
            </motion.div>
            <div className="relative mx-0">
              <div
                className="relative flex flex-col justify-center items-center gap-1 w-[35px] h-[35px] cursor-pointer bg-gray-200 hover:bg-gray-300 p-2.5 rounded-full transition-all duration-400"
                onClick={() => setToggle((prev) => !prev)}
              >
                <span
                  className={`w-[20px] rounded-md bg-gray-950 z-1 transition-all duration-300 ${
                    isToggled ? "rotate-45 h-1" : "h-1.5"
                  }`}
                />
                <span
                  className="w-[20px] h-1.5 rounded-md bg-gray-950 z-1 transition-all duration-300"
                  hidden={isToggled}
                />
                <span
                  className={`w-[20px] rounded-md bg-gray-950 z-1 transition-all duration-300 ${
                    isToggled ? "-translate-y-2 -rotate-45 h-1" : "h-1.5"
                  }`}
                />
              </div>
              <div
                className={`absolute bg-gray-200 rounded-full transition-all duration-400 flex items-end justify-center ${
                  isToggled
                    ? "-top-10 -left-30 w-[200px] h-[200px]"
                    : "top-0 left-0 w-[35px] h-[35px] -z-1"
                }`}
              >
                <nav
                  className="w-full place-items-center mb-7 relative z-2 transition duration-300"
                  hidden={!isToggled}
                >
                  <ul className="flex flex-col">
                    <li
                      className="w-full inline-flex py-0.5 px-2 hover:bg-gray-400 transition duration-300 rounded-md"
                      onClick={() => setToggle(false)}
                    >
                      <Link to="../home">
                        <i className="fa-solid fa-home mx-1 text-[16px]" />
                        <span className="font-semibold text-[15px] ml-1 text-gray-700">
                          Home
                        </span>
                      </Link>
                    </li>
                    <li
                      className="w-full inline-flex py-0.5 px-2 hover:bg-gray-400 transition duration-300 rounded-md"
                      onClick={() => setToggle(false)}
                    >
                      <Link to="../settings">
                        <i className="fa-solid fa-gear mx-1 text-[16px]" />
                        <span className="font-semibold text-[15px] ml-1 text-gray-700">
                          Settings
                        </span>
                      </Link>
                    </li>
                    <li
                      className="w-full inline-flex items-center py-0.5 px-2 hover:bg-gray-400 transition duration-300 rounded-md cursor-pointer"
                      onClick={() => {
                        setOpenNavs("logout_prompt");
                        setToggle(false);
                      }}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket mx-1 text-[16px] text-red-800" />
                      <span className="font-semibold text-[15px] ml-1 text-red-600">
                        Logout
                      </span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <ProfileSection
          onUpdateRequest={updateUserDataHandler}
          onDeleteRequest={() => setOpen((prev) => !prev)}
          isLoading={isLoading}
        />

        <footer
          className="absolute bottom-0 left-0 w-full h-[60px] bg-blend-screen flex items-center justify-between px-6 z-2"
          style={{
            background: "linear-gradient(to top, #030712, transparent)",
          }}
        >
          <div className="flex items-center justify-between gap-4 text-gray-500 text-sm">
            <a
              href="../../policies"
              className="hover:text-gray-400 font-medium cursor-pointer transition duration-300"
            >
              Policy
            </a>
            <a
              href="../../terms"
              className="hover:text-gray-400 font-medium cursor-pointer transition duration-300"
            >
              Terms
            </a>
          </div>
          <p className="text-sm text-gray-600">
            &copy; Destinify | All rights reserved
          </p>
        </footer>
      </main>

      <AnimatePresence>
        {openNavs === "wishlist" && (
          <Wishlist onClose={() => setOpenNavs("")} />
        )}
        {openNavs === "logout_prompt" && (
          <LogoutPrompt onClose={() => setOpenNavs("")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Modal onClose={() => setOpen(false)}>
            <header className="flex items-center justify-start bg-pink-900 py-1 px-2 rounded-lg">
              <h2 className="text-2xl text-red-50 font-extrabold capitalize pl-1.5">
                Fatal!
              </h2>
            </header>
            <div className="flex flex-col p-2">
              <div className="flex items-center mt-1.5 mb-3 gap-2">
                <i className="fa-solid fa-circle-exclamation text-3xl text-pink-700" />
                <p className="text-red-400 font-medium leading-5 mt-2 mb-3">
                  Do you really wish to remove your account from Destinify? This
                  action is <strong>irreversible</strong>!
                </p>
              </div>
              <div className="flex items-end justify-end pt-1.5">
                <button
                  type="button"
                  className={`${
                    isLoadingM ? "w-30" : "w-20"
                  } h-10 py-2 px-4 me-2 flex items-center justify-center bg-gray-950 border-2 border-gray-950 hover:bg-gray-700 hover:border-gray-700 rounded-md transition duration-300 group`}
                  onClick={openVerificationModal}
                >
                  {isLoadingM ? (
                    <>
                      <strong className="font-bold text-xs text-white">
                        Wait...
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
                  onClick={() => setOpen(false)}
                >
                  <span className="font-bold text-sm text-gray-950 group-hover:text-white">
                    No
                  </span>
                </button>
              </div>
            </div>
          </Modal>
        )}
        {open2 && (
          <VerifyOTPModal
            onSubmitOTP={deleteUserHandler}
            isLoading={isLoadingM}
            err={err}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProfilePage;
