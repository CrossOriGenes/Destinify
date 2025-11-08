import { useState } from "react";
import Dialog from "../UI/Dialog";

const EmailChangerDialog = ({ onClose, onDone, value, existingUserMsg }) => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function emailUpdateHandler() {
    const newEmail = email.toLowerCase().trim();
    if (!pattern.test(newEmail)) {
      setErr("Invalid email format!");
      return;
    }
    setErr("");
    onDone(newEmail);
  }

  return (
    <Dialog
      title="change your email"
      onClose={onClose}
      onAction={emailUpdateHandler}
    >
      <div className="w-full h-full relative p-3">
        <p className="text-[13px] font-medium text-gray-300 leading-4 mb-4">
          Change your current email to the desired email in the textbox below in
          order to update the value (avoid same duplications of existing
          email!).
        </p>
        <input
          type="email"
          id="edit-email"
          defaultValue={value}
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none w-full border-3 border-gray-500 py-2 px-4 rounded-3xl focus:ring-3 ring-purple-300 transition duration-400 text-md text-white placeholder:text-gray-600 font-medium"
          required
        />
        {err && !existingUserMsg && (
          <div className="w-[270px] py-1 px-2 text-wrap bg-red-950 border-1 border-red-800 rounded-sm mx-auto mt-3">
            <p className="text-red-400 text-[12.5px] font-semibold text-center">
              {err}
            </p>
          </div>
        )}
        {!err && existingUserMsg && (
          <div className="w-[270px] py-1 px-2 text-wrap bg-amber-950 border-1 border-amber-800 rounded-sm mx-auto mt-3">
            <p className="text-amber-400 text-[12.5px] font-semibold text-center">
              {existingUserMsg}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default EmailChangerDialog;
