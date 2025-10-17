import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import SigninForm from "../components/auth/SigninForm";
import SignupForm from "../components/auth/SignupForm";
import { AppContext } from "../components/store/AppContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Auth() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get("mode");
  const { preferredThemes, searchList, wishlist } = useContext(AppContext);
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
      setLoading(true);
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
      // console.log(data);
      toast.success(
        <div className="flex flex-col p-1.5">
          <h3 className="font-bold text-white text-lg">{data.msg}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {data.description}
          </p>
        </div>
      );
      navigate("../auth?mode=signin");
    } catch (err) {
      toast.error(
        <p className="text-[11px] font-semibold">Failed to register!</p>
      );
      console.error(err);
    } finally {
      setLoading(false);
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
            isLoading={loading}
            isActive={mode === "signup"}
            onToggle={() => navigate("../auth?mode=signin")}
            onSubmit={handleSignupRequest}
          />
          <SigninForm
            isActive={mode === "signin"}
            onToggle={() => navigate("../auth?mode=signup")}
          />
        </section>
      </main>
    </>
  );
}

export default Auth;
