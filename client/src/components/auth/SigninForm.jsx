import { useRef, useState } from "react";
import { motion } from "framer-motion";

const SigninForm = ({ isActive, onToggle, errMsg, isLoading, onSubmit }) => {
  const unameRef = useRef();
  const pswrdRef = useRef();
  const [show, setShow] = useState(false);

  function submitFormHandler(e) {
    e.preventDefault();
    if (!unameRef.current.value.trim() || !pswrdRef.current.value.trim())
      return;
    const signInData = {
      username: unameRef.current.value,
      password: pswrdRef.current.value,
    };
    onSubmit(signInData);
  }

  return (
    <motion.div
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ type: "tween", duration: 0.9, damping: 25 }}
      className={`relative flex justify-center items-center p-15 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute bottom-0 -right-5 w-[90%] h-[200px] bg-[url('/images/auth-bg-vector.png')] bg-cover bg-center opacity-55" />
      <div
        className={`relative w-full ${
          isActive ? "opacity-100" : "opacity-0 hidden"
        } flex flex-col justify-center items-center ml-12 -mr-6 px-6 transition-all duration-300`}
      >
        {errMsg && (
          <div className="max-w-[300px] flex items-center justify-center py-1.5 px-3 text-wrap bg-red-900 border-2 border-red-400 rounded-sm">
            <p className="text-[13px] font-semibold text-red-300">{errMsg}</p>
          </div>
        )}
        <h1 className="font-extrabold capitalize text-gray-100 z-2 mb-3">
          Sign<span className="text-indigo-500">In</span>
        </h1>
        <form
          className="relative w-full flex flex-col items-center px-4 z-2 mt-6"
          autoComplete="off"
          onSubmit={submitFormHandler}
        >
          <div className="relative w-[80%] flex flex-col mb-3">
            <label
              htmlFor="username"
              className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
            >
              Username
            </label>
            <input
              ref={unameRef}
              type="text"
              id="username"
              className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-200 placeholder:text-gray-600 font-medium"
              placeholder="Amit Singh"
              minLength={5}
              maxLength={15}
              required
            />
          </div>
          <div className="relative w-[80%] flex flex-col">
            <label
              htmlFor="password"
              className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
            >
              Password
            </label>
            <input
              ref={pswrdRef}
              type={show ? "text" : "password"}
              id="password"
              className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-200 placeholder:text-gray-600 font-medium"
              placeholder="Abc#12"
              minLength={6}
              required
            />
            <div className="absolute top-7 right-2 flex items-center justify-center w-8 h-8">
              <input
                type="checkbox"
                id="pass_1"
                hidden
                onChange={() => setShow((prev) => !prev)}
              />
              <label
                htmlFor="pass_1"
                className="text-lg text-gray-400 font-semibold"
              >
                {show ? (
                  <i className="fa-solid fa-eye-slash" />
                ) : (
                  <i className="fa-solid fa-eye" />
                )}
              </label>
            </div>
          </div>
          <div className="relative w-[75%] flex justify-end">
            <span className="font-medium text-[13px] text-cyan-400 hover:text-cyan-200 cursor-default capitalize mt-1.5 transition duration-300">
              Forgot password?
            </span>
          </div>
          <button
            className={`btn-dark z-2 flex items-center justify-center mt-7 ${
              isLoading
                ? "w-[200px] bg-gray-800 cursor-not-allowed select-none"
                : "w-[150px]"
            }`}
          >
            {isLoading ? (
              <>
                <strong className="font-bold tracking-wider text-white uppercase">
                  Logging in...
                </strong>
                <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
              </>
            ) : (
              <strong className="font-bold tracking-wider text-white uppercase">
                Login
              </strong>
            )}
          </button>
          <div className="mt-10 mb-4 mx-auto w-[80%] flex flex-col items-center">
            <p className="text-gray-400 text-sm font-bold">Or continue with:</p>
            <div className="w-full flex items-center justify-center gap-3 mt-3">
              <button
                type="button"
                className="w-11 h-11 border-2 border-gray-500 flex justify-center items-center hover:bg-gray-300 hover:border-gray-300 group transition-colors duration-300"
              >
                <i className="fa-brands fa-google text-2xl text-gray-300 group-hover:text-gray-950" />
              </button>
              <button
                type="button"
                className="w-11 h-11 border-2 border-gray-500 flex justify-center items-center hover:bg-gray-300 hover:border-gray-300 group transition-colors duration-300"
              >
                <i className="fa-brands fa-github text-2xl text-gray-300 group-hover:text-gray-950" />
              </button>
            </div>
            <p className="font-medium text-gray-500 text-sm mt-6">
              New to Destinify?{" "}
              <span
                className="text-indigo-400 font-medium hover:underline cursor-pointer"
                onClick={onToggle}
              >
                Register
              </span>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SigninForm;
