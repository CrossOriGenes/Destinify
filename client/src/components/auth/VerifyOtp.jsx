import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyOtp = () => {
  const [err, setErr] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    state: { otp_mail, email },
  } = useLocation();
  const navigate = useNavigate();

  function handleChange(e, i) {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[i] = value;
    setOtp(newOtp);
    if (value && i < 5) inputRefs.current[i + 1].focus();
  }
  function handleKeyDown(e, i) {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputRefs.current[i - 1].focus();
  }
  async function verifyOtpHandler(e) {
    e.preventDefault();
    let enteredOTP = "";
    if (otp.every((digit) => digit !== "")) enteredOTP = otp.join("");
    // console.log("Entered OTP: ", enteredOTP);
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/auth/verify_otp`, {
        method: "POST",
        body: JSON.stringify({ email: otp_mail, otp: enteredOTP }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.status === 400) {
        toast.error(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-red-100 text-[16px]">{result.msg}</h3>
            <p className="text-xs text-red-500 font-medium leading-3 mt-1.5">
              {result.description}
            </p>
          </div>
        );
        setErr(result.description);
        return;
      }
      toast.success(
        <div className="w-full flex flex-col px-1.5">
          <h3 className="font-bold text-white text-[16px]">{result.msg}</h3>
          <p className="text-xs text-gray-500 font-medium leading-3 mt-1.5">
            {result.description}
          </p>
        </div>
      );
      setErr("");
      navigate("../reset-password", {
        state: { otp_mail, email },
        replace: true,
      });
    } catch (err) {
      toast.error(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-red-100 text-[16px]">
            Failed to verify OTP!
          </h3>
          <p className="text-xs text-red-500 font-medium">
            Something went wrong! Please try later.
          </p>
        </div>
      );
      console.log("Failed to verify OTP!\n", err);
      return;
    } finally {
      setIsLoading(false);
    }
  }
  // useEffect(() => {
  //   console.log(email);
  // }, [email]);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-tr from-12% from-cyan-900 to-82% to-gray-900 bg-no-repeat overflow-hidden">
      <div className="w-full mx-auto flex flex-col items-center justify-center my-12">
        <h1 className="font-extrabold text-5xl text-white capitalize">
          Verify <span className="text-indigo-500">One-Time-Password</span>
        </h1>
        <div className="w-[35rem] mx-auto my-8 card bg-gray-700 p-5">
          <div className="relative flex items-start p-2 bg-blue-900 border-2 border-blue-600 rounded-sm">
            <i className="fa-solid fa-info-circle text-blue-500 text-lg ml-2 mr-3 mt-1.5" />
            <p className="text-sm font-medium text-blue-300">
              An OTP has been sent to &apos;
              <span className="font-bold">{otp_mail ? otp_mail : ""}</span>
              &apos;. Use that to verify & reset your password in the next step.
            </p>
          </div>
          {err && (
            <div className="bg-red-900 border-2 border-red-400 p-2 w-[20rem] text-center mx-auto mt-5 -mb-2 rounded-sm">
              <p className="text-red-300 text-sm font-medium leading-5 truncate">
                {err}
              </p>
            </div>
          )}
          <form
            className="w-full flex flex-col gap-6 mt-12"
            onSubmit={verifyOtpHandler}
            autoComplete="off"
          >
            <div className="w-full flex items-center justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  required
                  value={digit}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`outline-none border-2 border-gray-500 w-[3.5rem] h-[4rem] mx-1.5 text-center rounded-sm focus:ring-3 ring-teal-300 transition duration-300 text-4xl text-gray-200 font-semibold ${
                    isLoading ? "select-none pointer-events-none" : ""
                  }`}
                />
              ))}
            </div>
            <div className="relative w-full flex justify-end">
              <button
                className={`btn-dark z-1 py-2 group flex items-center justify-center ${
                  isLoading
                    ? "w-[160px] bg-gray-800 pointer-events-none select-none"
                    : "w-[130px]"
                } `}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <strong className="text-gray-400 group-hover:text-gray-800 font-bold tracking-wide transition duration-300">
                      Verifying...
                    </strong>
                    <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
                  </>
                ) : (
                  <strong className="text-gray-200 group-hover:text-gray-800 font-bold tracking-wide transition duration-300">
                    Verify
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

export default VerifyOtp;
