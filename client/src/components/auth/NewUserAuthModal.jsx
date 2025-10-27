import { useRef } from "react";
import Modal from "../UI/Modal";
import { getTodaysDate } from "./SignupForm";

const NewUserAuthModal = ({ onClose, onSubmit, errMsg, isLoading }) => {
  const usernameRef = useRef();
  const dobRef = useRef();
  function submitFormHandler(e) {
    e.preventDefault();
    if (!dobRef.current.value) return;
    const userData = {
      username: usernameRef.current.value,
      dob: dobRef.current.value,
    };
    console.log(userData);
    onSubmit(userData);
  }

  return (
    <Modal onClose={onClose}>
      <header className="flex items-center justify-start bg-violet-700 py-1.5 px-3 rounded-3xl">
        <h2 className="text-2xl text-white font-extrabold capitalize pl-1.5">
          Just a little more...
        </h2>
      </header>
      <div className="w-full flex flex-col justify-between gap-2">
        <div className="flex bg-indigo-900 border-1 border-indigo-500 p-2 mt-4 rounded-sm">
          <i className="fa-solid fa-info-circle text-indigo-600 mr-2" />
          <p className="leading-4 text-xs text-indigo-400 font-medium">
            Just a last step to authenticate you as our new user. Please
            complete this step by providing an unique{" "}
            <strong className="text-indigo-300 italic">username</strong> & your{" "}
            <strong className="text-indigo-300 italic">birthday </strong>
            to let us suggest you the best tourable places with our suggestive
            AI.
          </p>
        </div>
        {errMsg && (
          <div className="max-w-[300px] flex items-center justify-center py-1.5 px-3 text-wrap bg-red-900 border-2 border-red-400 rounded-sm mt-3 mb-2 mx-auto">
            <p className="text-xs font-semibold text-red-300">{errMsg}</p>
          </div>
        )}
        <form
          className="w-full relative p-2"
          autoComplete="off"
          onSubmit={submitFormHandler}
        >
          <div className="w-full flex flex-col">
            <label
              className="font-bold text-[13px] text-teal-400 ml-2 mb-[1px]"
              htmlFor="user-name"
            >
              Username
            </label>
            <input
              type="text"
              ref={usernameRef}
              id="user-name"
              className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-300 placeholder:text-gray-500 font-medium"
              minLength={3}
              maxLength={16}
              placeholder="Suman.143"
            />
          </div>
          <div className="w-full flex flex-col mt-3">
            <label
              className="font-bold text-[13px] text-teal-400 ml-2 mb-[1px]"
              htmlFor="dob-input"
            >
              Your DOB
            </label>
            <input
              type="date"
              ref={dobRef}
              id="dob-input"
              className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-indigo-300 transition duration-400 text-md text-gray-400 placeholder:text-gray-500 font-medium"
              max={getTodaysDate()}
              required
            />
          </div>
          <div className="w-full flex items-center justify-end mt-5">
            <button
              className={`group btn-dark z-2 flex items-center justify-center cursor-pointer ${
                isLoading
                  ? "w-[170px] select-none pointer-events-none bg-gray-700 text-gray-400"
                  : "w-[120px]"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <strong className="group-hover:text-gray-700 transition duration-300">
                    Submitting...
                  </strong>
                  <span className="block w-4 h-4 border-t-3 border-r-3 border-amber-200 ml-2 rounded-full animate-spin" />
                </>
              ) : (
                <strong className="group-hover:text-gray-700 transition duration-300">
                  Submit
                </strong>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewUserAuthModal;
