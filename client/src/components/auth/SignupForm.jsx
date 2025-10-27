import { useRef, useState } from "react";
import { motion } from "framer-motion";

export function getTodaysDate() {
  const dt = new Date();
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
// function getFormattedDate(date) {
//   const dt = new Date(date);
//   const yyyy = dt.getFullYear();
//   const mm = String(dt.getMonth() + 1).padStart(2, "0");
//   const dd = String(dt.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

const SignupForm = ({ isActive, onToggle, errMsg, onSubmit, isLoading }) => {
  const usernameRef = useRef();
  const mailRef = useRef();
  const dobRef = useRef();
  const passwordRef = useRef();
  const [show, setShow] = useState(false);

  function submitFormHandler(e) {
    e.preventDefault();
    if (
      !usernameRef.current.value.trim() ||
      !mailRef.current.value.trim() ||
      !dobRef.current.value.trim() ||
      !passwordRef.current.value.trim()
    )
      return;
    const data = {
      username: usernameRef.current.value,
      email: mailRef.current.value,
      dob: dobRef.current.value,
      password: passwordRef.current.value,
    };
    onSubmit(data);
  }

  return (
    <motion.div
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ type: "tween", duration: 0.9, damping: 25 }}
      className={`relative flex justify-center items-center p-15 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute bottom-0 -left-5 w-[90%] h-[200px] bg-[url('/images/auth-bg-vector.png')] scale-x-[-1] bg-cover bg-center opacity-55" />
      <div
        className={`relative w-full ${
          isActive ? "flex opacity-100" : "hidden opacity-0"
        } flex-col justify-center items-center -ml-6 mr-12 px-6 transition-all duration-300`}
      >
        {errMsg && (
          <div className="max-w-[300px] flex items-center justify-center py-1.5 px-3 text-wrap bg-red-900 border-2 border-red-400 rounded-sm mb-3">
            <p className="text-[13px] font-semibold text-red-300">{errMsg}</p>
          </div>
        )}
        <h1 className="font-extrabold capitalize text-gray-100 z-2 mb-6">
          Sign<span className="text-indigo-500">Up</span>
        </h1>
        <form
          className="relative w-full flex flex-col items-center px-4 z-2 my-6"
          onSubmit={submitFormHandler}
          autoComplete="off"
        >
          <div className="relative w-[85%] flex items-center justify-between mb-3">
            <div className="relative w-fit flex flex-col mr-2">
              <label
                htmlFor="u_name"
                className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
              >
                Your name
              </label>
              <input
                ref={usernameRef}
                type="text"
                id="u_name"
                className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-200 placeholder:text-gray-600 font-medium"
                placeholder="Amit Singh"
                minLength={5}
                maxLength={15}
                required
              />
            </div>
            <div className="relative w-fit flex flex-col mr-2">
              <label
                htmlFor="email"
                className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
              >
                Email
              </label>
              <input
                ref={mailRef}
                type="email"
                id="email"
                className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-200 placeholder:text-gray-600 font-medium text-ellipsis"
                placeholder="amit.singh.639@gmail.com"
                minLength={11}
                maxLength={30}
                required
              />
            </div>
          </div>
          <div className="relative w-[85%] flex items-center justify-between mb-3">
            <div className="relative w-fit flex flex-col">
              <label
                htmlFor="dob"
                className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
              >
                Birthday
              </label>
              <input
                ref={dobRef}
                type="date"
                id="dob"
                className="outline-none w-[215px] border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-200 placeholder:text-gray-600 font-medium"
                max={getTodaysDate()}
                required
              />
            </div>
            <div className="relative w-fit flex flex-col mr-2">
              <label
                htmlFor="pswrd"
                className="font-bold text-sm text-teal-400 ml-1.5 mb-[2px]"
              >
                Password
              </label>
              <input
                ref={passwordRef}
                type={show ? "text" : "password"}
                id="pswrd"
                className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-200 placeholder:text-gray-600 font-medium"
                placeholder="Abc#12"
                minLength={6}
                required
              />
              <div className="absolute top-7 right-2 flex items-center justify-center w-8 h-8">
                <input
                  type="checkbox"
                  id="pass_2"
                  hidden
                  onChange={() => setShow((prev) => !prev)}
                />
                <label
                  htmlFor="pass_2"
                  className="text-lg text-gray-500 font-semibold"
                >
                  {show ? (
                    <i className="fa-solid fa-eye-slash" />
                  ) : (
                    <i className="fa-solid fa-eye" />
                  )}
                </label>
              </div>
            </div>
          </div>
          <button
            className={`btn-dark z-2 mt-7 flex items-center justify-center ${
              isLoading
                ? "w-[200px] bg-gray-800 cursor-not-allowed select-none"
                : "w-[150px]"
            }`}
          >
            {isLoading ? (
              <>
                <strong className="font-bold tracking-wider text-white uppercase">
                  Signing Up...
                </strong>
                <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
              </>
            ) : (
              <strong className="font-bold tracking-wider text-white uppercase">
                Register
              </strong>
            )}
          </button>
          <div className="mt-10 mx-auto w-[80%] flex flex-col items-center">
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
              Already a member?{" "}
              <span
                className="text-indigo-400 font-medium hover:underline cursor-pointer"
                onClick={onToggle}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SignupForm;
