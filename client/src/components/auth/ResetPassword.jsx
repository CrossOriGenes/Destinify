import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const pswrdRef1 = useRef();
  const pswrdRef2 = useRef();
  const {
    state: { otp_mail, email },
  } = useLocation();
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const navigate = useNavigate();

  async function resetPasswordHandler(e) {
    e.preventDefault();
    const value = pswrdRef1.current.value;
    const value2 = pswrdRef2.current.value;
    if (value !== value2) {
      setErr("Passwords Didn't match!");
      return;
    }
    if (value === value2) setErr("");
    // console.log(value);
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/auth/resetpw`, {
        method: "POST",
        body: JSON.stringify({ email, password: value }),
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
      navigate("../../auth?mode=signin", { replace: true });
    } catch (err) {
      toast.error(
        <div className="flex flex-col px-1.5">
          <h3 className="font-bold text-red-100 text-[16px]">
            Failed to reset password!
          </h3>
          <p className="text-xs text-red-500 font-medium">
            Something went wrong! Please try later.
          </p>
        </div>
      );
      console.log("Failed to reset password!\n", err);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-tr from-12% from-cyan-900 to-82% to-gray-900 bg-no-repeat overflow-hidden">
      <div className="w-full mx-auto flex flex-col items-center justify-center my-12">
        <h1 className="font-extrabold text-5xl text-white capitalize">
          Reset <span className="text-indigo-500">Password</span>
        </h1>
        <div className="w-[35rem] mx-auto my-8 card bg-gray-700 p-5">
          <div className="relative flex items-start p-2 bg-blue-900 border-2 border-blue-600 rounded-sm">
            <i className="fa-solid fa-info-circle text-blue-500 text-lg ml-2 mr-3 mt-1.5" />
            <p className="text-xs font-medium text-blue-300">
              Type in new password to reset the previous one. Try mentaining the
              points to keep your password strong:-
              <br />
              - It should be of length 6 characters or above.
              <br />
              - It should contain atleast 1 lowercase alphabet.
              <br />
              - It should contain atleast 1 uppercase alphabet.
              <br />
              - It should contain atleast 1 digit(1-9).
              <br />- It should contain atleast 1 special
              character(!,@,#,$,%,^,&,*).
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
            className="w-full flex flex-col gap-6 mt-6"
            onSubmit={resetPasswordHandler}
            autoComplete="off"
          >
            <div className="w-full flex flex-col items-center justify-center">
              <div className="relative w-full">
                <input
                  type={show1 ? "text" : "password"}
                  ref={pswrdRef1}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%&^*])[A-Za-z\d@!#$%&^*]{6,}$"
                  placeholder="New Password"
                  className={`outline-none border-2 border-gray-500 w-full truncate py-2 px-4 rounded-3xl focus:ring-3 ring-teal-300 transition duration-300 text-md text-gray-200 placeholder:text-gray-500 font-semibold ${
                    isLoading ? "select-none pointer-events-none" : ""
                  }`}
                  minLength={6}
                  required
                />
                <div className="absolute top-1.5 right-2 flex items-center justify-center w-8 h-8">
                  <input
                    type="checkbox"
                    id="passw_1"
                    hidden
                    onChange={() => setShow1((prev) => !prev)}
                  />
                  <label
                    htmlFor="passw_1"
                    className="text-lg text-gray-400 font-semibold"
                  >
                    {show1 ? (
                      <i className="fa-solid fa-eye-slash" />
                    ) : (
                      <i className="fa-solid fa-eye" />
                    )}
                  </label>
                </div>
              </div>
              <div className="relative w-full mt-3.5">
                <input
                  type={show2 ? "text" : "password"}
                  ref={pswrdRef2}
                  placeholder="Re-type New Password"
                  className={`outline-none border-2 border-gray-500 w-full truncate py-2 px-4 rounded-3xl focus:ring-3 ring-teal-300 transition duration-300 text-md text-gray-200 placeholder:text-gray-500 font-semibold ${
                    isLoading ? "select-none pointer-events-none" : ""
                  }`}
                  minLength={6}
                  required
                />
                <div className="absolute top-1.5 right-2 flex items-center justify-center w-8 h-8">
                  <input
                    type="checkbox"
                    id="passw_2"
                    hidden
                    onChange={() => setShow2((prev) => !prev)}
                  />
                  <label
                    htmlFor="passw_2"
                    className="text-lg text-gray-400 font-semibold"
                  >
                    {show2 ? (
                      <i className="fa-solid fa-eye-slash" />
                    ) : (
                      <i className="fa-solid fa-eye" />
                    )}
                  </label>
                </div>
              </div>
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
                      Updating...
                    </strong>
                    <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
                  </>
                ) : (
                  <strong className="text-gray-200 group-hover:text-gray-800 font-bold tracking-wide transition duration-300">
                    Update
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

export default ResetPassword;
