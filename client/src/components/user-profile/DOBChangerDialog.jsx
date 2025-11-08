import { useState } from "react";
import Dialog from "../UI/Dialog";
import { getTodaysDate } from "../auth/SignupForm";

const DOBChangerDialog = ({ onClose, onDone, value }) => {
  const [bday, setBday] = useState("");
  const [err, setErr] = useState("");

  function dobUpdateHandler() {
    const selectedDate = new Date(bday);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < selectedDate.getDate())
    )
      age--;
    if (age <= 12) {
      setErr("Inappropriate age to enroll!");
      return;
    }
    setErr("");
    onDone({ bday, age });
  }

  return (
    <Dialog
      title="change your DOB"
      onClose={onClose}
      onAction={dobUpdateHandler}
    >
      <div className="w-full h-full relative p-3">
        <p className="text-[13px] font-medium text-gray-300 leading-4 mb-4">
          Choose your Date of Birth (DOB) from the date picker below in order to
          update it (Avoid enrolling DOB under{" "}
          <strong className="italic text-sm">12</strong> yrs of age!).
        </p>
        <input
          type="date"
          id="edit-bday"
          defaultValue={value}
          max={getTodaysDate()}
          onChange={(e) => setBday(e.target.value)}
          className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-purple-300 transition duration-400 text-md text-white placeholder:text-gray-600 font-medium"
          required
        />
        {err && (
          <div className="w-[270px] py-1 px-2 text-wrap bg-red-950 border-1 border-red-800 rounded-sm mx-auto mt-3">
            <p className="text-red-400 text-[12.5px] font-semibold text-center">
              {err}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default DOBChangerDialog;
