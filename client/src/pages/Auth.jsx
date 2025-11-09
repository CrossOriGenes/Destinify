import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AppContext } from "../components/store/AppContext";
import SigninForm from "../components/auth/SigninForm";
import SignupForm from "../components/auth/SignupForm";
import LoaderBackdrop2 from "../components/UI/LoaderBackdrop2";
import NewUserAuthModal from "../components/auth/NewUserAuthModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ORIGIN_URL = import.meta.env.VITE_API_ORIGIN;
// const ORIGIN_URL_2 = import.meta.env.VITE_API_ORIGIN_TEST;

function Auth() {
  const [loading, setLoading] = useState(null);
  const [open, setOpen] = useState("");
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [picture, setPicture] = useState("");
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get("mode");
  const { preferredThemes, searchList, wishlist, setAccessToken, setUser } =
    useContext(AppContext);
  const navigate = useNavigate();

  async function handleSignupRequest(formData) {
    const newData = {
      ...formData,
      preferred_themes: preferredThemes,
      recent_searches: searchList,
      wishlist,
    };
    // console.log(newData);
    try {
      setLoading("signup");
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 400) {
        setErr(data.errMsg);
        return;
      }
      setErr("");
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">{data.msg}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {data.description}
          </p>
        </div>
      );
      navigate("../auth?mode=signin", { replace: true });
      // console.log(data);
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to register!</p>
      );
      console.error(err);
    } finally {
      setLoading(null);
    }
  }
  async function handleSigninRequest(formData) {
    const newData = {
      ...formData,
      preferred_themes: preferredThemes,
      recent_searches: searchList,
      wishlist,
    };
    // console.log(formData);
    try {
      setLoading("signin");
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(newData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.status === 400) {
        setErr(data.errMsg);
        return;
      }
      setErr("");
      setAccessToken(data.token);
      setUser(data.user_data);
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">{data.msg}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {data.description}
          </p>
        </div>
      );
      navigate("../home", { replace: true });
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to login!</p>
      );
      console.error(err);
    } finally {
      setLoading(null);
    }
  }
  async function handleGoogleAuth() {
    const popup = window.open(
      `${BASE_URL}/auth/google`,
      "googleLoginPopup",
      "width=500,height=600,left=350,top=100,toolbar=no,menubar=no,resizable=no,scrollbar=no,status=no"
    );
    if (!popup) {
      toast.info(
        <div className="w-full flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">
            Popup Permission blocked!
          </h3>
          <p className="text-xs text-blue-500 font-medium">
            Please allow popups for this site to continue.
          </p>
        </div>
      );
      return;
    }
    window.addEventListener("message", async (e) => {
      if (!ORIGIN_URL.includes(e.origin)) {
        toast.warning(
          <p className="text-[11px] font-semibold">
            Unauthorized message origin!
          </p>
        );
        console.warn("Unauthorized origin: ", e.origin);
        return;
      }
      const data = e.data;
      if (data.isNew) {
        console.log("New user with username-" + data.username + " Logged in");
        setUsername(data.username);
        setEmail(data.email);
        setPicture(data.picture);
        setOpen("signin");
      } else {
        console.log("Old user with email-" + data.email + " Logged in");
        setUsername("");
        const tempData = {
          email: data.email,
          picture: data.picture,
        };
        await handleOldUserAuth(tempData);
      }
    });
  }
  async function handleGoogleSignup() {
    const popup = window.open(
      `${BASE_URL}/auth/signup/google`,
      "googleSignUpPopup",
      "width=500,height=600,left=350,top=100,toolbar=no,menubar=no,resizable=no,scrollbar=no,status=no"
    );
    if (!popup) {
      toast.info(
        <div className="w-full flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">
            Popup Permission blocked!
          </h3>
          <p className="text-xs text-blue-500 font-medium">
            Please allow popups for this site to continue.
          </p>
        </div>
      );
      return;
    }
    window.addEventListener("message", async (e) => {
      if (!ORIGIN_URL.includes(e.origin)) {
        toast.warning(
          <p className="text-[11px] font-semibold">
            Unauthorized message origin!
          </p>
        );
        console.warn("Unauthorized origin: ", e.origin);
        return;
      }
      const data = e.data;
      if (data.isNew) {
        console.log("New user with username-" + data.username + " registered.");
        setUsername(data.username);
        setEmail(data.email);
        setPicture(data.picture);
        setOpen("signup");
      } else {
        console.log("Existing user found!");
        setErr(data.description);
        toast.warning(
          <div className="w-full flex flex-col px-1.5">
            <h3 className="font-bold text-amber-100 text-lg">{data.errMsg}</h3>
            <p className="text-xs text-amber-500 font-medium leading-3.5 mt-1.5">
              {data.description}
            </p>
          </div>
        );
        return;
      }
    });
  }
  async function handleGithubAuth() {
    const popup = window.open(
      `${BASE_URL}/auth/github`,
      "githubLoginPopup",
      "width=500,height=600,left=350,top=100,toolbar=no,menubar=no,resizable=no,scrollbar=no,status=no"
    );
    if (!popup) {
      toast.info(
        <div className="w-full flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">
            Popup Permission blocked!
          </h3>
          <p className="text-xs text-blue-500 font-medium">
            Please allow popups for this site to continue.
          </p>
        </div>
      );
      return;
    }
    window.addEventListener("message", async (e) => {
      if (!ORIGIN_URL.includes(e.origin)) {
        toast.warning(
          <p className="text-[11px] font-semibold">
            Unauthorized message origin!
          </p>
        );
        console.warn("Unauthorized origin: ", e.origin);
        return;
      }
      const data = e.data;
      if (data.isNew) {
        console.log("New user with username-" + data.username + " Logged in");
        setUsername(data.username);
        setEmail(data.email);
        setPicture(data.picture);
        setOpen("signin");
      } else {
        console.log("Old user with email-" + data.email + " Logged in");
        setUsername("");
        const tempData = {
          email: data.email,
          picture: data.picture,
        };
        await handleOldUserAuth(tempData);
      }
    });
  }
  async function handleGithubSignup() {
    const popup = window.open(
      `${BASE_URL}/auth/github`,
      "githubSignUpPopup",
      "width=500,height=600,left=350,top=100,toolbar=no,menubar=no,resizable=no,scrollbar=no,status=no"
    );
    if (!popup) {
      toast.info(
        <div className="w-full flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">
            Popup Permission blocked!
          </h3>
          <p className="text-xs text-blue-500 font-medium">
            Please allow popups for this site to continue.
          </p>
        </div>
      );
      return;
    }
    window.addEventListener("message", async (e) => {
      if (!ORIGIN_URL.includes(e.origin)) {
        toast.warning(
          <p className="text-[11px] font-semibold">
            Unauthorized message origin!
          </p>
        );
        console.warn("Unauthorized origin: ", e.origin);
        return;
      }
      const data = e.data;
      if (data.isNew) {
        console.log("New user with username-" + data.username + " registered.");
        setUsername(data.username);
        setEmail(data.email);
        setPicture(data.picture);
        setOpen("signup");
      } else {
        console.log("Existing user found!");
        setErr(data.description);
        toast.warning(
          <div className="w-full flex flex-col px-1.5">
            <h3 className="font-bold text-amber-100 text-lg">{data.errMsg}</h3>
            <p className="text-xs text-amber-500 font-medium leading-3.5 mt-1.5">
              {data.description}
            </p>
          </div>
        );
        return;
      }
    });
  }
  async function handleNewUserAuth(userData) {
    const newUserData = {
      username: userData.username === "" ? username : userData.username,
      dob: userData.dob,
      picture,
      email,
      preferred_themes: preferredThemes,
      recent_searches: searchList,
      wishlist,
    };
    // console.log(newUserData);
    try {
      setLoading("new-user-auth");
      const res = await fetch(`${BASE_URL}/auth/new_user_auth`, {
        method: "POST",
        body: JSON.stringify(newUserData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.status === 400) {
        setErr(result.errMsg);
        return;
      }
      setErr("");
      setAccessToken(result.token);
      setUser(result.user_data);
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">{result.msg}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {result.description}
          </p>
        </div>
      );
      navigate("../home", { replace: true });
      console.log(result);
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to authenticate!</p>
      );
      setOpen(false);
      console.error(err);
      return;
    } finally {
      setLoading(null);
    }
  }
  async function handleNewUserAuth2(userData) {
    const newUserData = {
      username: userData.username === "" ? username : userData.username,
      dob: userData.dob,
      picture,
      email,
      preferred_themes: preferredThemes,
      recent_searches: searchList,
      wishlist,
    };
    // console.log(newUserData);
    try {
      setLoading("new-user-auth");
      const res = await fetch(`${BASE_URL}/auth/signup/new_user_auth`, {
        method: "POST",
        body: JSON.stringify(newUserData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.status === 400) {
        setErr(result.errMsg);
        return;
      }
      setErr("");
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">{data.msg}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {data.description}
          </p>
        </div>
      );
      navigate("../auth?mode=signin", { replace: true });
      // console.log(data);
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to signup!</p>
      );
      setOpen(false);
      console.error(err);
      return;
    } finally {
      setLoading(null);
    }
  }
  async function handleOldUserAuth(tempData) {
    const userData = {
      ...tempData,
      wishlist,
      preferred_themes: preferredThemes,
      recent_searches: searchList,
    };
    // console.log(userData);
    try {
      setLoading("old-user-auth");
      const res = await fetch(`${BASE_URL}/auth/old_user_auth`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.status === 400) {
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-red-100 text-[16px]">
              {result.errMsg}
            </h3>
            <p className="text-xs text-red-500 font-medium leading-3 mt-1.5">
              {result.description}
            </p>
          </div>
        );
        console.error(result.description);
        return;
      }
      setAccessToken(result.token);
      setUser(result.user_data);
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">{result.msg}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {result.description}
          </p>
        </div>
      );
      navigate("../home", { replace: true });
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to authenticate!</p>
      );
      console.error(err);
      return;
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <main>
        <section
          id="auth"
          className="relative grid grid-cols-2 bg-gray-800 w-full min-h-screen overflow-hidden"
        >
          <AnimatePresence>
            <div
              key={"auth-overlay"}
              className={`absolute bottom-0 left-0 w-full h-full bg-blend-screen z-2 flex ${
                mode === "signup" ? "flex-row-reverse" : ""
              } items-end justify-between py-4 px-8`}
              style={{
                background: "#111111",
                background:
                  mode === "signin"
                    ? "linear-gradient(20deg, rgba(17, 17, 17, 1) 10%, rgba(0, 0, 0, 0.05) 72%)"
                    : "linear-gradient(-20deg, rgba(17, 17, 17, 1) 10%, rgba(0, 0, 0, 0.05) 72%)",
              }}
            >
              <p className="text-sm text-gray-600">
                &copy; Destinify | All rights reserved
              </p>
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
            </div>
            <motion.div
              initial={{ translateX: 0 }}
              animate={{
                translateX: mode === "signin" ? "0" : "calc(100vw - 100%)",
              }}
              transition={{ type: "tween", duration: 0.7 }}
              className="absolute top-0 left-0 w-[850px] h-full z-1"
            >
              <motion.img
                key={"auth-img"}
                src={
                  mode === "signin"
                    ? "/images/auth_img-2.jpg"
                    : "/images/auth_img-1.jpg"
                }
                alt=""
                className={`absolute top-0 left-0 w-full h-full ${
                  mode === "signin"
                    ? "rounded-tr-[100px]"
                    : "rounded-tl-[100px]"
                } object-cover z-1`}
              />
            </motion.div>
          </AnimatePresence>

          <SignupForm
            errMsg={err}
            isLoading={loading === "signup"}
            isActive={mode === "signup"}
            onToggle={() => navigate("../auth?mode=signin")}
            onSubmit={handleSignupRequest}
            onGoogleSignup={handleGoogleSignup}
            onGithubSignUp={handleGithubSignup}
          />
          <SigninForm
            errMsg={err}
            isLoading={loading === "signin"}
            isActive={mode === "signin"}
            onToggle={() => navigate("../auth?mode=signup")}
            onSubmit={handleSigninRequest}
            onGoogleLogin={handleGoogleAuth}
            onGithubLogin={handleGithubAuth}
          />
        </section>
      </main>

      <AnimatePresence>
        {loading === "old-user-auth" && <LoaderBackdrop2 />}
      </AnimatePresence>

      <AnimatePresence>
        {open === "signin" && (
          <NewUserAuthModal
            onClose={() => setOpen("")}
            onSubmit={handleNewUserAuth}
            isLoading={loading === "new-user-auth"}
            errMsg={err}
          />
        )}

        {open === "signup" && (
          <NewUserAuthModal
            onClose={() => setOpen("")}
            onSubmit={handleNewUserAuth2}
            isLoading={loading === "new-user-auth"}
            errMsg={err}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Auth;
