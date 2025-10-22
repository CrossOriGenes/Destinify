import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPswrd = () => {
  const mailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function getOTPinMailHandler(e) {
    e.preventDefault();
    const value = mailRef.current.value;
    if (!value.trim()) return;
    try {
      // console.log(value);
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/auth/forgot_password`, {
        method: "POST",
        body: JSON.stringify({ email: value }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.status === 400) {
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-white text-[16px]">Input error!</h3>
            <p className="text-xs text-gray-500 font-medium">{result.errMsg}</p>
          </div>
        );
        return;
      }
      toast.success(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">{result.msg}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {result.description}
          </p>
        </div>
      );
      navigate("verify-otp", {
        state: { email: value },
        replace: true,
      });
    } catch (err) {
      toast.error(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">
            Failed to send data!
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Something went wrong! Please try later.
          </p>
        </div>
      );
      console.log("Failed to send email!\n", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-tr from-12% from-cyan-900 to-82% to-gray-900 bg-no-repeat overflow-hidden">
      <div className="w-full mx-auto flex flex-col items-center justify-center my-12">
        <h1 className="font-extrabold text-6xl text-white capitalize">
          Forgot <span className="text-indigo-500">password</span>?
        </h1>
        <div className="w-[35rem] mx-auto my-8 card bg-gray-700 p-5">
          <div className="relative flex items-center p-2 bg-blue-900 border-2 border-blue-600 rounded-sm">
            <i className="fa-solid fa-info-circle text-blue-500 text-lg ml-2 mr-3" />
            <p className="text-sm font-medium text-blue-300">
              Enter any valid email to get an OTP. Use that to verify & reset
              your password in the next step.
            </p>
          </div>
          <form
            className="w-full flex flex-col gap-2.5 mt-7"
            autoComplete="off"
            onSubmit={getOTPinMailHandler}
          >
            <input
              type="email"
              ref={mailRef}
              placeholder="Your email here..."
              className="outline-none border-2 border-gray-500 w-full truncate py-2 px-4 rounded-3xl focus:ring-3 ring-teal-300 transition duration-300 text-md text-gray-200 placeholder:text-gray-500 font-semibold"
              minLength={12}
              required
            />
            <div className="relative w-full flex justify-end">
              <button
                className={`btn-dark z-1 py-2 group flex items-center justify-center ${
                  isLoading
                    ? "w-[150px] bg-gray-800 pointer-events-none select-none"
                    : "w-[130px]"
                } `}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <strong className="text-gray-400 group-hover:text-gray-800 font-bold tracking-wide transition duration-300">
                      Getting...
                    </strong>
                    <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
                  </>
                ) : (
                  <strong className="text-gray-200 group-hover:text-gray-800 font-bold tracking-wide transition duration-300">
                    Get OTP
                  </strong>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPswrd;
