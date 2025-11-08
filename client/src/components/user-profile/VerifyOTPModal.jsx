import { useState, useRef } from "react";
import Modal from "../UI/Modal";

const VerifyOTPModal = ({ err, isLoading, onSubmitOTP }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  
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
  function handleOTPSubmission(e) {
    e.preventDefault();
    let enteredOTP = "";
    if (otp.every((digit) => digit !== "")) enteredOTP = otp.join("");
    onSubmitOTP(enteredOTP);
  }

  return (
    <Modal>
      <header className="flex items-center justify-start bg-purple-800 py-1 px-2 rounded-lg">
        <h2 className="text-2xl text-purple-50 font-extrabold capitalize pl-1.5">
          Verify OTP
        </h2>
      </header>
      <div className="w-full mt-4 bg-transparent">
        <div className="relative flex items-start p-2 bg-blue-900 border-2 border-blue-600 rounded-sm">
          <i className="fa-solid fa-info-circle text-blue-500 text-lg ml-2 mr-3 mt-1.5" />
          <p className="text-[12.5px] font-medium text-blue-300">
            An OTP has been sent to the email registered with this account. Use
            that to verify & reset your password in the next step.
          </p>
        </div>
        {err && (
          <div className="bg-red-900 border-2 border-red-400 p-2 w-[210px] text-center mx-auto mt-5 -mb-2 rounded-sm">
            <p className="text-red-300 text-[13px] font-medium leading-5 truncate">
              {err}
            </p>
          </div>
        )}
        <form
          className="w-full flex flex-col gap-6 mt-6"
          onSubmit={handleOTPSubmission}
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
                className={`outline-none border-2 border-gray-500 w-[3.5rem] h-[4rem] not-last:mr-1.5 text-center rounded-sm focus:ring-3 ring-blue-300 transition duration-300 text-4xl text-gray-200 font-semibold ${
                  isLoading ? "select-none pointer-events-none" : ""
                }`}
              />
            ))}
          </div>
          <div className="relative w-full flex justify-end">
            <button
              className="btn-dark z-1 group flex items-center justify-center w-[120px] disabled:w-[160px] disabled:bg-gray-800 disabled:pointer-events-none disabled:select-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <strong className="text-gray-400 group-hover:text-gray-800 text-sm font-bold tracking-wide transition duration-300">
                    Verifying...
                  </strong>
                  <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
                </>
              ) : (
                <strong className="text-gray-200 group-hover:text-gray-800 text-sm font-bold tracking-wide transition duration-300">
                  Verify
                </strong>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default VerifyOTPModal;
